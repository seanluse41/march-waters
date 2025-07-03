// netlify/functions/renew-webhook.js
import { google } from 'googleapis';

export default async (req) => {
  try {
    const { next_run } = await req.json();
    console.log("Push notification renewal function started. Next invocation at:", next_run);

    // Check environment variables
    const credentials = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    const calendarId = process.env.VITE_GOOGLE_CALENDAR_ID;
    
    console.log("Environment check:", {
      hasCredentials: !!credentials,
      hasCalendarId: !!calendarId,
      calendarId: calendarId || 'Missing'
    });

    if (!credentials || !calendarId) {
      throw new Error('Missing required environment variables');
    }

    // Parse credentials
    let parsedCredentials;
    try {
      parsedCredentials = JSON.parse(credentials);
      console.log("Credentials parsed successfully. Client email:", parsedCredentials.client_email);
    } catch (error) {
      console.error("Failed to parse credentials:", error);
      throw new Error('Invalid credentials format');
    }

    // Create calendar client
    console.log("Creating Google Calendar client...");
    const auth = new google.auth.JWT(
      parsedCredentials.client_email,
      null,
      parsedCredentials.private_key,
      ['https://www.googleapis.com/auth/calendar'],
      null
    );

    const calendar = google.calendar({ version: 'v3', auth });
    console.log("Calendar client created successfully");

    // Test API access first
    console.log("Testing API access...");
    try {
      const testEvents = await calendar.events.list({
        calendarId: calendarId,
        maxResults: 1,
        singleEvents: true,
        orderBy: 'startTime',
        timeMin: new Date().toISOString()
      });
      console.log("✅ API access working - found", testEvents.data.items?.length || 0, "upcoming events");
    } catch (apiError) {
      console.error("❌ API access failed:", apiError.message);
      throw apiError;
    }

    // Create new push notification channel
    console.log("Creating new push notification channel...");
    const channelId = `scheduled-${Date.now()}`;
    const expiration = Date.now() + (6 * 24 * 60 * 60 * 1000); // 6 days
    const webhookUrl = 'https://march-waters.netlify.app/webhooks/calendar';

    const watchRequest = {
      calendarId: calendarId,
      requestBody: {
        id: channelId,
        type: "web_hook",
        address: webhookUrl,
        expiration: expiration.toString()
      }
    };

    console.log("Watch request:", JSON.stringify(watchRequest, null, 2));

    const response = await calendar.events.watch(watchRequest);

    console.log("✅ Push notification channel created successfully!");
    console.log("Response:", JSON.stringify(response.data, null, 2));

    const expirationDate = new Date(parseInt(response.data.expiration));
    console.log("Channel expires on:", expirationDate.toISOString());

    console.log("\nRenewal Summary:");
    console.log("Channel ID:", response.data.id);
    console.log("Resource ID:", response.data.resourceId);
    console.log("Expiration:", expirationDate.toISOString());

    return new Response(JSON.stringify({
      message: "Push notification channel renewed successfully",
      summary: {
        channelId: response.data.id,
        resourceId: response.data.resourceId,
        expiration: expirationDate.toISOString(),
        webhookUrl: webhookUrl
      },
      nextRun: next_run
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error("Fatal error in push notification renewal:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({
      error: 'Failed to renew push notification channel',
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export const config = {
  schedule: "0 0 */7 * *" // Every 7 days at midnight
}
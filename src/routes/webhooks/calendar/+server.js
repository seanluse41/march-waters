// src/routes/webhooks/calendar/+server.js
import { google } from 'googleapis';
import { sendConfirmationEmail } from '$lib/requests/sendEmail.js';
import { updateEventDescription } from '$lib/requests/updateEventDescription.js';

const CREDENTIALS = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const CONFIRMED_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_CONFIRMED_ID;

async function getCalendarClient() {
  const jsonCredentials = JSON.parse(CREDENTIALS);

  const auth = new google.auth.JWT(
    jsonCredentials.client_email,
    null,
    jsonCredentials.private_key,
    ['https://www.googleapis.com/auth/calendar'],
    null
  );

  return google.calendar({ version: 'v3', auth });
}

async function getConfirmedEventDirect() {
  try {
    const calendar = await getCalendarClient();

    const response = await calendar.events.list({
      calendarId: CONFIRMED_CALENDAR_ID,
      singleEvents: true,
      orderBy: 'updated',
      maxResults: 250,
    });

    console.log(response.data.items)

    const mostRecentEvent = response.data.items?.[0] || null;

    return {
      success: true,
      event: mostRecentEvent,
      hasEvents: !!mostRecentEvent
    };
  } catch (error) {
    console.error('Error fetching confirmed event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function POST({ request }) {
  try {
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('=== Calendar Webhook Received ===');
    console.log('Timestamp:', new Date().toISOString());
    
    const resourceState = headers['x-goog-resource-state'];
    
    if (resourceState === 'sync') {
      console.log('Sync message - webhook setup confirmation');
      return new Response('OK', { status: 200 });
    }
    
    if (resourceState === 'exists') {
      console.log('Calendar event changed - checking for recent confirmations');
      
      // Fetch the most recent confirmed event directly
      const eventResult = await getConfirmedEventDirect();
      
      if (!eventResult.success || !eventResult.hasEvents) {
        console.log('No confirmed events found');
        return new Response('OK', { status: 200 });
      }
      
      const event = eventResult.event;
      const description = event.description || '';
      console.log("event to change ----------------")
      console.log(event)
      
      // Check if this event has already been processed
      if (description.includes('@@Confirmed@@')) {
        console.log('Event already confirmed and processed, skipping');
        return new Response('OK', { status: 200 });
      }
      
      // Only process events that have @@Added@@ but not @@Confirmed@@
      if (!description.includes('@@Added@@')) {
        console.log('Event does not have @@Added@@ marker, skipping');
        return new Response('OK', { status: 200 });
      }
      
      // Extract email from description
      const emailMatch = description.match(/メールアドレス:\s*(.+)/);
      if (!emailMatch) {
        console.log('No email found in event description');
        return new Response('OK', { status: 200 });
      }
      
      const recipientEmail = emailMatch[1].trim();
      console.log('Found event with email:', recipientEmail);
      console.log('Event summary:', event.summary);
      
      // Determine service type from event summary
      let serviceType = 'consultation';
      if (event.summary && event.summary.includes('あとはねるだけ')) {
        serviceType = 'childcare';
      }
      
      console.log('Sending confirmation email to:', recipientEmail);
      
      // Send confirmation email
      const emailResult = await sendConfirmationEmail(event, recipientEmail, serviceType);
      
      if (emailResult.success) {
        console.log('Confirmation email sent successfully');
        
        // Mark the event as confirmed
        const updateResult = await updateEventDescription(CONFIRMED_CALENDAR_ID, event.id, 'Confirmed');
        if (updateResult.success) {
          console.log('Event marked as confirmed');
        } else {
          console.error('Failed to mark event as confirmed:', updateResult.error);
        }
      } else {
        console.error('Failed to send confirmation email:', emailResult.error);
      }
    }
    
    return new Response('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
}
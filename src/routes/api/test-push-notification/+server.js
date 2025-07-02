// src/routes/api/test-push-notification/+server.js
import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

const CREDENTIALS = JSON.parse(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const WEBHOOK_URL = 'https://march-waters.netlify.app/webhooks/calendar';

async function getCalendarClient() {
  const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    ['https://www.googleapis.com/auth/calendar'],
    null
  );
  return google.calendar({ version: 'v3', auth });
}

export async function POST() {
  try {
    console.log('Testing push notification setup...');
    console.log('Calendar ID:', CALENDAR_ID);
    console.log('Webhook URL:', WEBHOOK_URL);
    
    const calendar = await getCalendarClient();
    
    // First verify API access works
    console.log('Testing basic API access...');
    const testEvents = await calendar.events.list({
      calendarId: CALENDAR_ID,
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
      timeMin: new Date().toISOString()
    });
    console.log('✅ API access working');
    
    // Now create push notification channel
    console.log('Creating push notification channel...');
    const channelId = `push-${Date.now()}`;
    const expiration = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    
    const watchRequest = {
      calendarId: CALENDAR_ID,
      requestBody: {
        id: channelId,
        type: "web_hook",
        address: WEBHOOK_URL,
        expiration: expiration.toString()
      }
    };
    
    console.log('Watch request:', JSON.stringify(watchRequest, null, 2));
    
    const response = await calendar.events.watch(watchRequest);
    
    console.log('✅ Push notification channel created successfully!');
    console.log('Response:', response.data);
    
    return json({
      success: true,
      message: "Push notification channel created successfully",
      channelId: response.data.id,
      resourceId: response.data.resourceId,
      expiration: new Date(parseInt(response.data.expiration)).toISOString(),
      webhookUrl: WEBHOOK_URL
    });
    
  } catch (error) {
    console.error('❌ Push notification setup failed:', error);
    
    return json({
      success: false,
      error: error.message,
      code: error.code,
      status: error.status,
      details: error.response?.data || 'No additional details available'
    }, { status: 500 });
  }
}

export async function GET() {
  return json({
    message: "POST to this endpoint to test push notification setup",
    webhookUrl: WEBHOOK_URL,
    calendarId: CALENDAR_ID
  });
}
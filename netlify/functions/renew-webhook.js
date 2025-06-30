// netlify/functions/renew-webhook.js
import { google } from 'googleapis';

const CREDENTIALS = JSON.parse(process.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
const CALENDAR_ID = process.env.VITE_GOOGLE_CALENDAR_ID;
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

export const handler = async (event, context) => {
  // Only run on scheduled events
  if (event.httpMethod !== 'POST' || !event.headers['netlify-cron']) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const calendar = await getCalendarClient();
    const channelId = crypto.randomUUID();
    
    const watchRequest = {
      calendarId: CALENDAR_ID,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: WEBHOOK_URL,
        expiration: Date.now() + (6 * 24 * 60 * 60 * 1000) // 6 days
      }
    };

    const response = await calendar.events.watch(watchRequest);
    
    console.log('Webhook renewed:', {
      channelId: response.data.id,
      expiration: new Date(parseInt(response.data.expiration))
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        channelId: response.data.id,
        expiration: response.data.expiration 
      })
    };
    
  } catch (error) {
    console.error('Webhook renewal failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
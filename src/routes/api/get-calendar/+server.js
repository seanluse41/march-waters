import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

// Get environment variables using Vite syntax
const CREDENTIALS = JSON.parse(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;

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

export async function GET({ url }) {
  try {
    const timeMin = url.searchParams.get('timeMin') || new Date().toISOString();
    const timeMax = url.searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const maxResults = parseInt(url.searchParams.get('maxResults') || '10', 10);

    const calendar = await getCalendarClient();

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return json({
      events: response.data.items,
      nextPageToken: response.data.nextPageToken
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch calendar events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
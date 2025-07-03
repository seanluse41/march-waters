import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

const CREDENTIALS = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const CONFIRMED_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_CONFIRMED_ID;

async function getCalendarClient() {
  const jsonCredentials = await JSON.parse(CREDENTIALS)

  const auth = new google.auth.JWT(
    jsonCredentials.client_email,
    null,
    jsonCredentials.private_key,
    ['https://www.googleapis.com/auth/calendar'],
    null
  );

  return google.calendar({ version: 'v3', auth });
}

export async function GET() {
  try {
    const calendar = await getCalendarClient();

    const response = await calendar.events.list({
      calendarId: CONFIRMED_CALENDAR_ID,
      singleEvents: true,
      orderBy: 'updated',
      maxResults: 1,
    });

    const mostRecentEvent = response.data.items?.[0] || null;

    return json({
      event: mostRecentEvent,
      hasEvents: !!mostRecentEvent
    });
  } catch (error) {
    console.error('Error fetching confirmed event:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch confirmed event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
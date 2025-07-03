import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

// Get environment variables using Vite syntax
const CREDENTIALS = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const PERSONAL_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_PERSONAL_ID;
const UNCONFIRMED_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_UNCONFIRMED_ID;
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

async function fetchCalendarEvents(calendar, calendarId, timeMin, timeMax) {
  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items || [];
  } catch (error) {
    console.error(`Error fetching events from calendar ${calendarId}:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeMin = today.toISOString();
    
    const threeMonthsFromNow = new Date(today);
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    const timeMax = threeMonthsFromNow.toISOString();

    const calendar = await getCalendarClient();

    // Fetch events from all three calendars in parallel
    const [personalEvents, unconfirmedEvents, confirmedEvents] = await Promise.all([
      fetchCalendarEvents(calendar, PERSONAL_CALENDAR_ID, timeMin, timeMax),
      fetchCalendarEvents(calendar, UNCONFIRMED_CALENDAR_ID, timeMin, timeMax),
      fetchCalendarEvents(calendar, CONFIRMED_CALENDAR_ID, timeMin, timeMax)
    ]);

    // Combine all events
    const allEvents = [
      ...personalEvents,
      ...unconfirmedEvents,
      ...confirmedEvents
    ];

    return json({
      events: allEvents,
      nextPageToken: null
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch calendar events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
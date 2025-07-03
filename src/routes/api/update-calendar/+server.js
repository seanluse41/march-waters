import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

const CREDENTIALS = JSON.parse(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_UNCONFIRMED_ID;

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

export async function POST({ request }) {
  try {
    const eventData = await request.json();
    
    if (!eventData.summary) {
      return new Response(
        JSON.stringify({ error: 'Event summary is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!eventData.start || !eventData.end) {
      return new Response(
        JSON.stringify({ error: 'Event start and end times are required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const calendar = await getCalendarClient();

    // Create event in the unconfirmed calendar
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: eventData,
    });

    return json({
      success: true,
      event: response.data
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create calendar event' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
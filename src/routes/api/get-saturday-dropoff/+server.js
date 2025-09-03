// src/routes/api/get-saturday-dropoff/+server.js
import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

const CREDENTIALS = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
const UNCONFIRMED_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_UNCONFIRMED_ID;

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

export async function GET() {
  try {
    const calendar = await getCalendarClient();
    
    // Get current date and determine starting point
    const now = new Date();
    const currentDay = now.getDay();
    
    // If today is Saturday, start from next Saturday
    let startDate = new Date(now);
    if (currentDay === 6) { // Saturday
      startDate.setDate(now.getDate() + 7);
    } else {
      // Otherwise, find the next Saturday
      const daysUntilSaturday = (6 - currentDay + 7) % 7 || 7;
      startDate.setDate(now.getDate() + daysUntilSaturday);
    }
    
    // Set to beginning of day
    startDate.setHours(0, 0, 0, 0);
    
    // End date is 4 weeks from start date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 28); // 4 weeks
    
    // Fetch recurring events
    const response = await calendar.events.list({
      calendarId: UNCONFIRMED_CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      q: '託児サービス', // Search for the specific event
      singleEvents: true, // Expand recurring events
      orderBy: 'startTime',
      maxResults: 4 // Get only 4 events
    });
    
    // Filter to only Saturday託児サービス events
    const saturdayEvents = (response.data.items || []).filter(event => {
      if (!event.start?.dateTime) return false;
      const eventDate = new Date(event.start.dateTime);
      return eventDate.getDay() === 6 && // Is Saturday
             event.summary?.includes('託児サービス'); // Has the right title
    }).slice(0, 4); // Ensure we only return 4 events
    
    return json({
      events: saturdayEvents,
      success: true
    });
    
  } catch (error) {
    console.error('Error fetching Saturday events:', error);
    return json({ 
      error: 'Failed to fetch Saturday events',
      success: false 
    }, { status: 500 });
  }
}
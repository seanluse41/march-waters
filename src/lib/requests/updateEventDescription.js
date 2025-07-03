// src/lib/requests/updateEventDescription.js
import { google } from 'googleapis';

const CREDENTIALS = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

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

export async function updateEventDescription(calendarId, eventId, status) {
  try {
    if (!['Edited', 'Confirmed'].includes(status)) {
      throw new Error('Status must be either "Edited" or "Confirmed"');
    }

    const calendar = await getCalendarClient();

    // First, get the current event
    const eventResponse = await calendar.events.get({
      calendarId,
      eventId
    });

    const event = eventResponse.data;
    let description = event.description || '';

    // Remove any existing status markers
    description = description.replace(/@@(Added|Edited|Confirmed)@@\s*$/g, '').trim();

    // Add the new status marker
    description = description + `\n@@${status}@@`;

    // Update the event
    await calendar.events.update({
      calendarId,
      eventId,
      requestBody: {
        ...event,
        description
      }
    });

    console.log(`Event ${eventId} description updated with status: ${status}`);

    return {
      success: true
    };

  } catch (error) {
    console.error('Error updating event description:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
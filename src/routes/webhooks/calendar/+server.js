// src/routes/webhooks/calendar/+server.js
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { updateEventDescription } from '$lib/requests/updateEventDescription.js';
import { childCareEmailTemplate } from '$lib/emails/childCare.js';
import { consultationEmailTemplate } from '$lib/emails/consult.js';
import { dropoffEmailTemplate } from '$lib/emails/dropoff.js';

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

async function sendConfirmationEmailDirect(eventData, recipientEmail, serviceType, eventId) {
  try {
    const emailUser = import.meta.env.VITE_EMAIL_USER;
    const emailPass = import.meta.env.VITE_EMAIL_PASS;

    if (!emailUser || !emailPass) {
      throw new Error('Email configuration missing');
    }

    // Determine service type from event summary if not provided
    if (!serviceType) {
      const { summary } = eventData;
      if (summary.includes('訪問型')) {
        serviceType = 'babysitter';
      }
      else if (summary.includes('お預かり')) {
        serviceType = 'dropoff'
      } else {
        serviceType = 'consultation';
      }
    }

    const emailContent = serviceType === 'childcare'
      ? childCareEmailTemplate(eventData, eventId)
      : consultationEmailTemplate(eventData, eventId);

    let transporter = nodemailer.createTransport({
      host: 'smtp.porkbun.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    let info = await transporter.sendMail({
      from: emailUser,
      to: recipientEmail,
      subject: 'March Waters - 予約確定',
      text: emailContent,
    });

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
async function getRecentConfirmedEvents() {
  try {
    const calendar = await getCalendarClient();

    const response = await calendar.events.list({
      calendarId: CONFIRMED_CALENDAR_ID,
      singleEvents: true,
      orderBy: 'updated',
      maxResults: 10,
    });

    return {
      success: true,
      events: response.data.items || [],
      hasEvents: !!(response.data.items?.length)
    };
  } catch (error) {
    console.error('Error fetching confirmed events:', error);
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

      // Fetch recent confirmed events
      const eventResult = await getRecentConfirmedEvents();

      if (!eventResult.success || !eventResult.hasEvents) {
        console.log('No confirmed events found');
        return new Response('OK', { status: 200 });
      }

      // Check all events for ones that need confirmation emails
      for (const event of eventResult.events) {
        const description = event.description || '';

        // Skip if already processed
        if (description.includes('@@Confirmed@@')) {
          continue;
        }

        // Only process events that have @@Added@@ but not @@Confirmed@@
        if (!description.includes('@@Added@@')) {
          continue;
        }

        // Extract email from description
        const emailMatch = description.match(/メールアドレス:\s*(.+)/);
        if (!emailMatch) {
          console.log('No email found in event:', event.summary);
          continue;
        }

        const recipientEmail = emailMatch[1].trim();
        console.log('Processing event:', event.summary, 'for email:', recipientEmail);

        // Determine service type from event summary
        let serviceType;
        if (event.summary && event.summary.includes('訪問型')) {
          serviceType = 'babysitter';
        } else if (event.summary && event.summary.includes('お預かり')) {
          serviceType = 'dropoff';
        } else {
          serviceType = 'consultation'
        }
        console.log('Sending confirmation email to:', recipientEmail);

        // Send confirmation email
        const emailResult = await sendConfirmationEmailDirect(event, recipientEmail, serviceType, event.id);

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
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
}
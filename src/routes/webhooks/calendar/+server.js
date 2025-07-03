// Updated webhook handler with time-based filtering
import { getConfirmedEvent } from '$lib/requests/getConfirmedEvent.js';
import { sendConfirmationEmail } from '$lib/requests/sendEmail.js';

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
      
      // Fetch the most recent confirmed event
      const eventResult = await getConfirmedEvent();
      
      if (!eventResult.success || !eventResult.hasEvents) {
        console.log('No confirmed events found');
        return new Response('OK', { status: 200 });
      }
      
      const event = eventResult.event;
      const updatedTime = new Date(event.updated);
      const now = new Date();
      const timeDifferenceMinutes = (now - updatedTime) / (1000 * 60);
      
      console.log('Event updated:', updatedTime.toISOString());
      console.log('Current time:', now.toISOString());
      console.log('Time difference (minutes):', timeDifferenceMinutes);
      
      // Only process if updated within last 1 minute
      if (timeDifferenceMinutes > 1) {
        console.log('Event not recently updated, skipping email');
        return new Response('OK', { status: 200 });
      }
      
      // Extract email from description
      const description = event.description || '';
      const emailMatch = description.match(/メールアドレス:\s*(.+)/);
      if (!emailMatch) {
        console.log('No email found in event description');
        return new Response('OK', { status: 200 });
      }
      
      const recipientEmail = emailMatch[1].trim();
      console.log('Sending confirmation email to:', recipientEmail);
      
      // Determine service type from event summary
      let serviceType = 'consultation';
      if (event.summary && event.summary.includes('あとはねるだけ')) {
        serviceType = 'childcare';
      }
      
      // Send confirmation email
      const emailResult = await sendConfirmationEmail(event, recipientEmail, serviceType);
      
      if (emailResult.success) {
        console.log('Confirmation email sent successfully');
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
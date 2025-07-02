// src/routes/webhooks/calendar/+server.js

export async function POST({ request }) {
  try {
    const headers = Object.fromEntries(request.headers.entries());
    
    // Log all headers for debugging
    console.log('=== Calendar Webhook Received ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(headers, null, 2));
    
    // Google sends these specific headers
    const channelId = headers['x-goog-channel-id'];
    const resourceId = headers['x-goog-resource-id'];
    const resourceState = headers['x-goog-resource-state'];
    const messageNumber = headers['x-goog-message-number'];
    
    console.log('Google Calendar Notification:', {
      channelId,
      resourceId,
      resourceState,
      messageNumber
    });
    
    // Handle different resource states
    if (resourceState === 'sync') {
      console.log('Sync message - webhook setup confirmation');
    } else if (resourceState === 'exists') {
      console.log('Calendar event changed - triggering refresh');
      // Here you could trigger a cache refresh or notify your app
    }
    
    const body = await request.text();
    if (body) {
      console.log('Body:', body);
    }
    
    console.log('================================');
    
    return new Response('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
}

export async function GET({ url }) {
  // Handle Google's verification challenge
  const challenge = url.searchParams.get('hub.challenge');
  const verify_token = url.searchParams.get('hub.verify_token');
  
  if (challenge) {
    console.log('Webhook verification challenge:', challenge);
    return new Response(challenge, { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Manual trigger for testing
  if (url.searchParams.get('test') === 'true') {
    console.log('Manual webhook test triggered');
    return new Response('Webhook endpoint is working', { status: 200 });
  }
  
  return new Response('Calendar webhook endpoint', { status: 200 });
}
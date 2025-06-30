// src/routes/webhooks/calendar/+server.js
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const headers = Object.fromEntries(request.headers.entries());
    const body = await request.text();
    
    console.log('=== Calendar Webhook Received ===');
    console.log('Headers:', headers);
    console.log('Body:', body);
    console.log('Timestamp:', new Date().toISOString());
    console.log('================================');
    
    // Parse body if it's JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
      console.log('Parsed Body:', JSON.stringify(parsedBody, null, 2));
    } catch (e) {
      console.log('Body is not JSON:', body);
    }
    
    return json({ success: true, received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

export async function GET({ url }) {
  // Handle verification challenge for webhook setup
  const challenge = url.searchParams.get('hub.challenge');
  const verify_token = url.searchParams.get('hub.verify_token');
  
  console.log('Webhook verification:', { challenge, verify_token });
  
  if (challenge) {
    return new Response(challenge, { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  return json({ message: 'Calendar webhook endpoint' });
}
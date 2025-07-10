// src/routes/webhooks/payment/+server.js
import { json } from '@sveltejs/kit';

const STRIPE_WEBHOOK_SECRET = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_TEST_SECRET_KEY;
export async function POST({ request }) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('Missing stripe-signature header');
      return new Response('Missing signature', { status: 400 });
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return new Response('Server configuration error', { status: 500 });
    }

    // Verify the webhook signature
    const stripe = await import('stripe');
    const stripeInstance = new stripe.default(STRIPE_SECRET_KEY);
    
    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response('Invalid signature', { status: 400 });
    }

    console.log('=== Stripe Webhook Received ===');
    console.log('Event type:', event.type);
    console.log('Event ID:', event.id);
    console.log('Timestamp:', new Date().toISOString());

    // Handle the payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      console.log('✅ Payment succeeded!');
      console.log('Payment Intent ID:', paymentIntent.id);
      console.log('Amount:', paymentIntent.amount, paymentIntent.currency);
      console.log('Customer email:', paymentIntent.receipt_email);
      console.log('Payment method:', paymentIntent.payment_method);
      
      // Log the full payment intent for debugging
      console.log('Full payment intent object:', JSON.stringify(paymentIntent, null, 2));
      
      // TODO: Add logic here to:
      // 1. Find the corresponding calendar event
      // 2. Update the event description with payment status
      // 3. Send confirmation email if needed
      
    } else {
      console.log('Unhandled event type:', event.type);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
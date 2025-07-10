// src/routes/webhooks/payment/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripeSecretKey = import.meta.env.VITE_STRIPE_TEST_SECRET_KEY;
const endpointSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(stripeSecretKey);

export async function POST({ request }) {
  console.log("request received")
    const payload = await request.text();
    const sig = request.headers.get('stripe-signature');
    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    console.log('=== Stripe Webhook Received ===');
    console.log('Event type:', event.type);
    console.log('Event ID:', event.id);
    console.log('Timestamp:', new Date().toISOString());

    if (event.type === 'checkout.session.completed') {
        const paymentIntent = event.data.object;
        
        console.log('✅ Payment succeeded via payment link!');
        console.log('Payment Intent ID:', paymentIntent.id);
        console.log('Amount:', paymentIntent.amount, paymentIntent.currency);
        console.log('Customer email:', paymentIntent.receipt_email);
        console.log('Full payment intent object:', JSON.stringify(paymentIntent, null, 2));
        
        // TODO: Add logic here to:
        // 1. Find the corresponding calendar event
        // 2. Update the event description with payment status
        // 3. Send confirmation email if needed
        
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    return json({ received: true });
}
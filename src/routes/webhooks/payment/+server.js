// src/routes/webhooks/payment/+server.js
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { updateEventDescription } from '$lib/requests/updateEventDescription.js';

const stripeSecretKey = import.meta.env.VITE_STRIPE_TEST_SECRET_KEY;
const endpointSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
const CONFIRMED_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_CONFIRMED_ID;
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
        const session = event.data.object;
        
        console.log('✅ Payment succeeded via payment link!');
        console.log('Session ID:', session.id);
        console.log('Amount:', session.amount_total, session.currency);
        console.log('Customer email:', session.customer_details?.email);
        console.log('Client reference ID:', session.client_reference_id);
        console.log('Full session object:', JSON.stringify(session, null, 2));
        
        // Update calendar event with payment status
        if (session.client_reference_id) {
            console.log('Updating calendar event with payment status...');
            const updateResult = await updateEventDescription(
                CONFIRMED_CALENDAR_ID, 
                session.client_reference_id, 
                'Paid'
            );
            
            if (updateResult.success) {
                console.log('✅ Calendar event updated with Paid status');
            } else {
                console.error('❌ Failed to update calendar event:', updateResult.error);
            }
        } else {
            console.log('⚠️ No client_reference_id found - cannot update calendar event');
        }
        
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    return json({ received: true });
}
import Stripe from 'stripe';
import { json } from '@sveltejs/kit';

const key = import.meta.env.VITE_STRIPE_TEST_SECRET_KEY

const stripe = new Stripe(key);

export async function POST({ request }) {
  try {
    const { selectedCourseName, customerName, customerEmail, customerPhone } = await request.json();

    if (!selectedCourseName || !customerName || !customerEmail) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Map course names to product IDs on server side
    let productId;
    
    if (selectedCourseName.includes('通常コース') || selectedCourseName.includes('Standard Care')) {
      productId = import.meta.env.VITE_STRIPE_CHILDCARE_WITH_MEAL;
    } else if (selectedCourseName.includes('アレルギー対応') || selectedCourseName.includes('Allergy-Friendly')) {
      productId = import.meta.env.VITE_STRIPE_CHILDCARE_NO_MEAL;
    } else if (selectedCourseName.includes('メール相談') || selectedCourseName.includes('Email Consultation')) {
      productId = import.meta.env.VITE_STRIPE_CONSULT_EMAIL;
    } else if (selectedCourseName.includes('じっくり相談') || selectedCourseName.includes('In-depth Consultation')) {
      productId = import.meta.env.VITE_STRIPE_CONSULT_60MIN;
    } else if (selectedCourseName.includes('さくっと相談') || selectedCourseName.includes('Quick Consultation')) {
      productId = import.meta.env.VITE_STRIPE_CONSULT_30MIN;
    } else {
      return json({ error: `Unknown course name: ${selectedCourseName}` }, { status: 400 });
    }

    // Get product details from Stripe
    const product = await stripe.products.retrieve(productId);
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1
    });

    if (prices.data.length === 0) {
      return json({ error: 'No active price found for product' }, { status: 400 });
    }

    const price = prices.data[0];

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      metadata: {
        product_name: product.name,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || ''
      }
    });

    return json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: price.unit_amount,
      currency: price.currency
    });

  } catch (error) {
    console.error('Stripe error:', error);
    return json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
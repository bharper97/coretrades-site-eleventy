// Netlify Function: Create Stripe Checkout Session (subscription)
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { email } = JSON.parse(event.body || '{}');
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_FOUNDERS, quantity: 1 }],
      customer_email: email || undefined,
      success_url: `${process.env.SITE_URL}/welcome.html`,
      cancel_url: `${process.env.SITE_URL}/billing.html`,
      metadata: { plan: 'founding-50' }
    });
    return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
}

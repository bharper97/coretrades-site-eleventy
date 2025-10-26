// Netlify Function: Stripe Webhook to toggle access
import Stripe from 'stripe';
export const config = { bodyParser: false };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function readRawBody(event) {
  if (event.isBase64Encoded) return Buffer.from(event.body || '', 'base64');
  return Buffer.from(event.body || '');
}
async function activateEmployer(email){ console.log('ACTIVATE:', email); }
async function deactivateEmployer(email){ console.log('DEACTIVATE:', email); }
export async function handler(event) {
  const sig = event.headers['stripe-signature'];
  let raw = await readRawBody(event);
  let evt;
  try {
    evt = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return { statusCode: 400, body: `Webhook Error: ${e.message}` };
  }
  try {
    switch (evt.type) {
      case 'checkout.session.completed': {
        const s = evt.data.object;
        await activateEmployer(s.customer_details?.email || s.customer_email);
        break;
      }
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const sub = evt.data.object;
        try {
          const c = await stripe.customers.retrieve(sub.customer);
          await deactivateEmployer(c.email);
        } catch(e){ console.log('customer lookup failed', e.message); }
        break;
      }
      default: break;
    }
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (e) {
    return { statusCode: 500, body: `Handler Error: ${e.message}` };
  }
}

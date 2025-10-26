// Netlify Function: Stripe Webhook to toggle access
import Stripe from 'stripe';
export const config = { bodyParser: false };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function readRawBody(event){ return event.isBase64Encoded ? Buffer.from(event.body||'', 'base64') : Buffer.from(event.body||''); }
async function activateEmployer(e){ console.log('ACTIVATE:', e); }
async function deactivateEmployer(e){ console.log('DEACTIVATE:', e); }
export async function handler(event){
  const sig = event.headers['stripe-signature'];
  let raw = await readRawBody(event);
  let evt;
  try{ evt = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch(e){ return { statusCode: 400, body: `Webhook Error: ${e.message}` }; }
  try{
    switch(evt.type){
      case 'checkout.session.completed': {
        const s = evt.data.object;
        await activateEmployer(s.customer_details?.email || s.customer_email);
        break;
      }
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const sub = evt.data.object;
        try { const c = await stripe.customers.retrieve(sub.customer); await deactivateEmployer(c.email); } catch(e){ console.log('lookup failed', e.message); }
        break;
      }
      default: break;
    }
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }catch(e){ return { statusCode: 500, body: `Handler Error: ${e.message}` }; }
}

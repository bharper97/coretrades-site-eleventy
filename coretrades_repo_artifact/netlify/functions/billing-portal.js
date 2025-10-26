// Netlify Function: Create Customer Portal session
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function handler(event){
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try{
    const { customerId } = JSON.parse(event.body || '{}');
    if(!customerId) return { statusCode: 400, body: 'Missing customerId' };
    const portal = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${process.env.SITE_URL}/billing.html` });
    return { statusCode: 200, headers: { 'content-type':'application/json' }, body: JSON.stringify({ url: portal.url }) };
  }catch(err){ return { statusCode: 500, body: `Error: ${err.message}` }; }
}

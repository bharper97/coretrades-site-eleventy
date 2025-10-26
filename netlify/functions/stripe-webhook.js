// Netlify Function: Stripe Webhook to toggle access
import Stripe from 'stripe';

export const config = { bodyParser: false };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function readRawBody(event) {
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, 'base64');
  }
  return Buffer.from(event.body || '');
}

// TODO: replace with your datastore. For week 1, we’ll just log.
async function activateEmployer(customerEmail) {
  console.log('ACTIVATE:', customerEmail);
}
async function deactivateEmployer(customerEmail) {
  console.log('DEACTIVATE:', customerEmail);
}

export async function handler(event, context) {
  const sig = event.headers['stripe-signature'];
  let rawBody = await readRawBody(event);

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const sess = stripeEvent.data.object;
        await activateEmployer(sess.customer_details?.email || sess.customer_email);
        break;
      }
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const sub = stripeEvent.data.object;
        try {
          const customer = await stripe.customers.retrieve(sub.customer);
          await deactivateEmployer(customer.email);
        } catch (e) {
          console.log('Lookup customer failed', e.message);
        }
        break;
      }
      default:
        // ignore others for now
        break;
    }
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    return { statusCode: 500, body: `Handler Error: ${err.message}` };
  }
}

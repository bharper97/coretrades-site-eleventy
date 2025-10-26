# CoreTrades – Stripe-Ready (Netlify)

This package wires Stripe subscriptions into your existing Netlify site.

## What’s included
- `netlify/functions/checkout.js` – creates Stripe Checkout Session (subscription)
- `netlify/functions/stripe-webhook.js` – receives Stripe events and toggles access (placeholder logging)
- `netlify/functions/billing-portal.js` – opens Stripe Customer Portal
- `netlify.toml` – Netlify config
- `package.json` – includes Stripe SDK
- `welcome.html` & `billing.html`

## Required Netlify environment variables (LIVE values)
- `STRIPE_SECRET_KEY` = **sk_live_...** (do not commit keys)
- `STRIPE_PRICE_FOUNDERS` = **price_...** (live Price ID for $34.99 CAD/month)
- `SITE_URL` = **https://transcendent-basbousa-df97ea.netlify.app** (or your custom domain)
- `STRIPE_WEBHOOK_SECRET` = **whsec_...** (from Stripe → Developers → Webhooks → Add endpoint)

> ⚠️ Do NOT commit secrets to Git. Set them in Netlify → Site settings → Environment variables.

## Frontend button
A floating “Join Founding 50 – $34.99/mo” button is injected in `index.html`. It calls the `/.netlify/functions/checkout` endpoint and redirects to Stripe Checkout.

## Webhook
Add a live webhook in Stripe pointing to:
```
https://YOUR_DOMAIN/.netlify/functions/stripe-webhook
```
Select events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

Copy the **Signing secret** → set it as `STRIPE_WEBHOOK_SECRET` in Netlify.

## Going further
- Replace placeholder `activateEmployer`/`deactivateEmployer` with real datastore updates.
- Replace the floating button with an on-brand CTA in your pricing section.

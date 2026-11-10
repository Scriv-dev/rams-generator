# Setting up accounts and Stripe payments

This guide switches on the **Pro** plan: sign-in by emailed link, a Stripe subscription, and RAMS saved to the user's account. Until you finish it, the site works as before and the landing page shows Pro as "Coming soon".

Do everything in **Stripe test mode** first. Allow about an hour.

## How it fits together

```
Browser (GitHub Pages)                 Supabase                          Stripe
───────────────────────                ────────                          ──────
app.html + account.js  ── sign in ──▶  Auth (emailed link)
                       ── Upgrade ──▶  create-checkout-session ──────▶  Checkout page
                                                                         │ customer pays
                       ◀── redirect back to app.html?checkout=success ───┘
                                       stripe-webhook  ◀── webhook ───  subscription events
                                       └─ writes subscriptions table
                       ── Save ─────▶  rams_documents (allowed only if is_pro())
                       ── Manage ───▶  create-portal-session ────────▶  Customer portal
```

Payment is enforced in the database (`supabase/migrations/…_accounts_and_pro.sql`). The browser code only decides what to show; the server refuses to save to an account without an active subscription.

## What you need

- A [Supabase](https://supabase.com) account (the free tier is fine to start).
- A [Stripe](https://stripe.com) account.
- The [Supabase CLI](https://supabase.com/docs/guides/cli) on your computer, to deploy the functions.

## 1. Create the Supabase project

1. In Supabase, click **New project**. For UK customers, choose the **London (eu-west-2)** region so data stays in the UK.
2. Open **SQL Editor**, paste the whole of `supabase/migrations/20261110000000_accounts_and_pro.sql` and click **Run**.
   - Or, with the CLI: `supabase link --project-ref <your-project-ref>` then `supabase db push`.
3. Open **Project Settings → API** and note the **Project URL**, the **anon public** key and the project ref (the `abcdefghijkl` part of the URL).

## 2. Set up sign-in

1. Open **Authentication → URL Configuration**.
   - **Site URL:** `https://scriv-dev.github.io/rams-generator/app.html`
   - **Redirect URLs:** add `https://scriv-dev.github.io/rams-generator/app.html` and, for local testing, `http://localhost:8000/app.html`.
2. Email sign-in is on by default (**Authentication → Providers → Email**).
3. Optional: edit the **Magic Link** email under **Authentication → Email Templates** so it mentions RAMS Generator.

> Supabase's built-in email service only sends a few emails an hour. Before launch, connect your own email provider under **Project Settings → Authentication → SMTP Settings** (for example Resend, Postmark or Amazon SES).

## 3. Create the product in Stripe (test mode)

1. Make sure the **Test mode** switch is on.
2. **Product catalogue → Add product:** name it "RAMS Generator Pro" and add a **recurring** price (monthly, yearly or both). Copy the **price ID** (`price_…`). If you add both, use the one you want as the default; you can let customers switch in the portal.
3. **Settings → Billing → Customer portal:** turn it on, and allow customers to update payment methods, view invoices and cancel subscriptions.
4. **Developers → API keys:** copy the **Secret key** (`sk_test_…`). Never put it in `config.js` or commit it.

## 4. Deploy the Edge Functions

From the repository folder:

```bash
supabase login
supabase link --project-ref <your-project-ref>

supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_PRICE_ID=price_... \
  SITE_URL=https://scriv-dev.github.io/rams-generator \
  ALLOWED_ORIGIN=https://scriv-dev.github.io

supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook --no-verify-jwt
```

`stripe-webhook` runs without Supabase login checks because Stripe can't send one. It checks Stripe's signature on every request instead.

## 5. Connect the Stripe webhook

1. In Stripe, open **Developers → Webhooks → Add endpoint**.
2. **Endpoint URL:** `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
3. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.paused`
   - `customer.subscription.resumed`
4. Copy the endpoint's **Signing secret** (`whsec_…`) and save it:

   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 6. Fill in `config.js`

```js
window.RAMS_CONFIG = {
  supabaseUrl: 'https://<your-project-ref>.supabase.co',
  supabaseAnonKey: '<anon public key>',
  proPriceLabel: '£15 a month' // or leave '' until you've decided
};
```

The anon key is meant to be public, so it's safe to commit. Commit and push to `main`; GitHub Pages republishes in a minute or two.

## 7. Test it end to end

1. Open the site, go to the generator and click **Sign in**. Use your own email and tap the link.
2. Click **Upgrade to Pro**. On Stripe's page, pay with the test card `4242 4242 4242 4242`, any future expiry date and any CVC.
3. You return to the app with "Switching on Pro…", which should change to "You're on Pro" within a few seconds. If it doesn't, check **Developers → Webhooks** in Stripe for failed deliveries, and the `stripe-webhook` logs in Supabase.
4. Generate and save a RAMS. Sign in on another browser or your phone: it should be in the list.
5. Open the account menu, click **Manage billing** and cancel. To test a lapsed plan straight away, cancel the subscription immediately in the Stripe dashboard. The app should drop back to Free and show the account RAMS as read-only.

## 8. Go live

1. Switch Stripe to **live mode** and create the product and price again (test and live are separate).
2. Add a live webhook endpoint with the same URL and events.
3. Update the secrets with the live values:

   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_PRICE_ID=price_... STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Before you take real payments

These aren't code, but you need them in place:

- **Privacy policy and terms of service** pages, linked from the landing page and checkout. You'll be storing names, emails and documents, so UK GDPR applies.
- **ICO data protection fee:** most UK businesses processing personal data must pay it.
- **VAT:** if you're VAT-registered, turn on Stripe Tax and set `STRIPE_AUTOMATIC_TAX=true` with `supabase secrets set`. Checkout will then collect addresses and VAT numbers and add VAT.
- **Your own email provider** for sign-in emails (see step 2).
- **Content review:** have a competent health and safety professional review the RAMS content, as paying customers will expect it to be checked.

Get advice from an accountant and a solicitor on the tax and legal points.

## Settings reference

| Where | Name | Value |
|---|---|---|
| `config.js` | `supabaseUrl` | Supabase project URL |
| `config.js` | `supabaseAnonKey` | Supabase anon public key |
| `config.js` | `proPriceLabel` | Text shown for the price, e.g. `£15 a month` |
| Supabase secret | `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` / `sk_live_…`) |
| Supabase secret | `STRIPE_PRICE_ID` | Stripe price ID for Pro (`price_…`) |
| Supabase secret | `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) |
| Supabase secret | `SITE_URL` | `https://scriv-dev.github.io/rams-generator` (no trailing slash) |
| Supabase secret | `ALLOWED_ORIGIN` | `https://scriv-dev.github.io` |
| Supabase secret | `STRIPE_AUTOMATIC_TAX` | Optional. `true` to collect VAT with Stripe Tax |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are provided to the functions automatically.

// Opens the Stripe customer portal, where a Pro user can update their card,
// download invoices or cancel. Returns the portal URL.
import { adminClient, findCustomerId, json, preflight, requestUser, siteUrl, stripe } from '../_shared/common.ts';

Deno.serve(async (req) => {
  const early = preflight(req);
  if (early) return early;
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);

  try {
    const user = await requestUser(req);
    if (!user) return json({ error: 'Sign in to manage billing.' }, 401);

    const customerId = await findCustomerId(adminClient(), user.id);
    if (!customerId) return json({ error: 'There’s no billing account for you yet. Upgrade to Pro first.' }, 404);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl()}/app.html`,
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('create-portal-session failed', err);
    return json({ error: 'Couldn’t open billing. Please try again in a moment.' }, 500);
  }
});

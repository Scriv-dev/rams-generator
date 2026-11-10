// Starts a Stripe Checkout session for the Pro subscription and returns its URL.
// Called from the app by a signed-in user.
import { adminClient, env, findCustomerId, json, preflight, PRO_STATUSES, requestUser, siteUrl, stripe } from '../_shared/common.ts';

Deno.serve(async (req) => {
  const early = preflight(req);
  if (early) return early;
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);

  try {
    const user = await requestUser(req);
    if (!user) return json({ error: 'Sign in to upgrade.' }, 401);

    const admin = adminClient();

    // Don't let someone pay twice.
    const { data: existing, error: subError } = await admin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .in('status', PRO_STATUSES)
      .limit(1);
    if (subError) throw subError;
    if (existing && existing.length) {
      return json({ error: 'You already have Pro. Use Manage billing to change your plan.' }, 409);
    }

    // Find or create the Stripe customer for this user.
    let customerId = await findCustomerId(admin, user.id);
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      const { error: insertError } = await admin
        .from('customers')
        .insert({ user_id: user.id, stripe_customer_id: customer.id });
      if (insertError) {
        // Two tabs raced: keep the record that won and discard ours.
        customerId = await findCustomerId(admin, user.id);
        if (!customerId) throw insertError;
        await stripe.customers.del(customer.id).catch(() => {});
      } else {
        customerId = customer.id;
      }
    }

    const automaticTax = Deno.env.get('STRIPE_AUTOMATIC_TAX') === 'true';
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: env('STRIPE_PRICE_ID'), quantity: 1 }],
      subscription_data: { metadata: { supabase_user_id: user.id } },
      allow_promotion_codes: true,
      success_url: `${siteUrl()}/app.html?checkout=success`,
      cancel_url: `${siteUrl()}/app.html?checkout=cancelled`,
      ...(automaticTax
        ? {
            automatic_tax: { enabled: true },
            tax_id_collection: { enabled: true },
            customer_update: { address: 'auto', name: 'auto' },
          }
        : {}),
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session failed', err);
    return json({ error: 'Couldn’t start checkout. Please try again in a moment.' }, 500);
  }
});

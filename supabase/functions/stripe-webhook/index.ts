// Receives Stripe webhooks and keeps the subscriptions table up to date.
// Deploy with JWT verification off (Stripe doesn't send a Supabase token);
// every request is checked against STRIPE_WEBHOOK_SECRET instead.
import Stripe from 'npm:stripe@14.25.0';
import { adminClient, env, stripe, syncSubscription } from '../_shared/common.ts';

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const SUBSCRIPTION_EVENTS = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
]);

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Use POST.', { status: 405 });

  const signature = req.headers.get('Stripe-Signature');
  if (!signature) return new Response('Missing Stripe-Signature header.', { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      env('STRIPE_WEBHOOK_SECRET'),
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.warn('Rejected webhook with a bad signature', err);
    return new Response('Invalid signature.', { status: 400 });
  }

  try {
    const admin = adminClient();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.subscription) {
        const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        await syncSubscription(admin, subId);
      }
    } else if (SUBSCRIPTION_EVENTS.has(event.type)) {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscription(admin, sub.id);
    }
    // Other event types are acknowledged and ignored.

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // A 500 makes Stripe retry the event later.
    console.error(`Failed to handle ${event.type} (${event.id})`, err);
    return new Response('Webhook handler failed.', { status: 500 });
  }
});

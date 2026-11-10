// Shared helpers for the RAMS Generator Edge Functions.
import Stripe from 'npm:stripe@14.25.0';
import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2.45.4';

export function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

/** Site address without a trailing slash, e.g. https://example.github.io/rams-generator */
export function siteUrl(): string {
  return env('SITE_URL').replace(/\/+$/, '');
}

export const stripe = new Stripe(env('STRIPE_SECRET_KEY'), {
  // Pinned so field names (e.g. subscription.current_period_end) don't change under us.
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

/** Service-role client: bypasses row-level security. Only use on the server. */
export function adminClient(): SupabaseClient {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** The signed-in user who made this request, or null. */
export async function requestUser(req: Request): Promise<User | null> {
  const authorization = req.headers.get('Authorization');
  if (!authorization) return null;
  const client = createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/* ---------- CORS and JSON responses ---------- */

function corsHeaders(): Record<string, string> {
  return {
    // Set ALLOWED_ORIGIN to your site's origin (e.g. https://example.github.io) in production.
    'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

export function preflight(req: Request): Response | null {
  return req.method === 'OPTIONS' ? new Response('ok', { headers: corsHeaders() }) : null;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

/* ---------- Billing helpers ---------- */

export const PRO_STATUSES = ['active', 'trialing'];

export async function findCustomerId(admin: SupabaseClient, userId: string): Promise<string | null> {
  const { data, error } = await admin
    .from('customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.stripe_customer_id ?? null;
}

/** Copy the current state of a Stripe subscription into the subscriptions table. */
export async function syncSubscription(admin: SupabaseClient, subscriptionId: string): Promise<void> {
  // Always read the latest version from Stripe, so webhooks arriving out of order
  // can't overwrite a newer status with an older one.
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

  let userId = sub.metadata?.supabase_user_id || null;
  if (!userId) {
    const { data, error } = await admin
      .from('customers')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    if (error) throw error;
    userId = data?.user_id ?? null;
  }
  if (!userId) {
    console.warn(`No user found for Stripe customer ${customerId}; subscription ${sub.id} not recorded.`);
    return;
  }

  const { error } = await admin.from('subscriptions').upsert({
    id: sub.id,
    user_id: userId,
    status: sub.status,
    price_id: sub.items.data[0]?.price.id ?? null,
    current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/*
 * RAMS Generator settings.
 *
 * Leave supabaseUrl blank to run without accounts: the generator, printing and
 * saving in the browser all still work, and the Pro features are hidden.
 *
 * Both Supabase values are public by design (they're sent to every visitor's
 * browser). The database rules in supabase/migrations keep each user's data
 * private. Never put the service_role key or any Stripe secret key here.
 */
window.RAMS_CONFIG = {
  // Project URL from Supabase: Project Settings > API, e.g. 'https://abcdefghijkl.supabase.co'
  supabaseUrl: '',

  // The "anon public" key from the same page.
  supabaseAnonKey: '',

  // Shown on the landing page and upgrade button, e.g. '£15 a month'.
  // Leave blank until you've set your price in Stripe.
  proPriceLabel: ''
};

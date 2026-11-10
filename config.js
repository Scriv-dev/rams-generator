/*
 * RAMS Generator settings.
 *
 * Every setting is optional. Leave one blank and that feature is switched off:
 *   - supabaseUrl blank: no accounts; the generator, printing and saving in the
 *     browser all still work, and the Pro features are hidden.
 *   - formspreeId blank: no feedback links.
 *   - goatcounterCode blank: no visitor counting.
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
  proPriceLabel: '',

  // Feedback form. Create a form at https://formspree.io and paste its ID here:
  // the part after /f/ in the form's endpoint, e.g. 'xyzabcde'.
  // Leave blank to hide the feedback links.
  formspreeId: 'xeagjqez',

  // Visitor counter. Create a site at https://www.goatcounter.com and paste its
  // code here: the 'mysite' in https://mysite.goatcounter.com.
  // No cookies are used. Leave blank to turn counting off.
  goatcounterCode: 'scriv-dev'
};

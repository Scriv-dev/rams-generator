-- RAMS Generator: accounts, Stripe subscriptions and cloud-saved RAMS.
--
-- Run this once in your Supabase project (SQL editor, or `supabase db push`).
--
-- Who can write what:
--   customers, subscriptions  -> written only by the Edge Functions (service role).
--                                Signed-in users can read their own rows.
--   rams_documents            -> users read and delete their own documents at any time;
--                                creating or updating needs an active Pro subscription.

-- ---------------------------------------------------------------------------
-- Stripe customer for each user
-- ---------------------------------------------------------------------------

create table if not exists public.customers (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at         timestamptz not null default now()
);

alter table public.customers enable row level security;

drop policy if exists "Users can read their own customer record" on public.customers;
create policy "Users can read their own customer record"
  on public.customers for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Stripe subscriptions, kept in sync by the stripe-webhook function
-- ---------------------------------------------------------------------------

create table if not exists public.subscriptions (
  id                   text primary key,             -- Stripe subscription id (sub_...)
  user_id              uuid not null references auth.users (id) on delete cascade,
  status               text not null,                -- active, trialing, past_due, canceled, ...
  price_id             text,
  current_period_end   timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at           timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can read their own subscriptions" on public.subscriptions;
create policy "Users can read their own subscriptions"
  on public.subscriptions for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Is this user on Pro right now?
-- security definer so RLS policies on other tables can call it.
-- ---------------------------------------------------------------------------

-- Takes no argument, so a user can only ever ask about themselves.
create or replace function public.is_pro()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.user_id = auth.uid()
      and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

revoke all on function public.is_pro() from public, anon;
grant execute on function public.is_pro() to authenticated;

-- ---------------------------------------------------------------------------
-- RAMS saved to the user's account (Pro)
-- ---------------------------------------------------------------------------

create table if not exists public.rams_documents (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id         text not null,                           -- same id the app uses locally
  title      text not null default '',
  "values"   jsonb not null default '{}'::jsonb,      -- the form details
  html       text not null default '',                -- the document, including in-place edits
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  constraint rams_documents_id_length check (char_length(id) between 1 and 64),
  constraint rams_documents_title_length check (char_length(title) <= 300),
  constraint rams_documents_html_size check (octet_length(html) <= 2000000)
);

create index if not exists rams_documents_user_updated_idx
  on public.rams_documents (user_id, updated_at desc);

alter table public.rams_documents enable row level security;

drop policy if exists "Users can read their own RAMS" on public.rams_documents;
create policy "Users can read their own RAMS"
  on public.rams_documents for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Users can delete their own RAMS" on public.rams_documents;
create policy "Users can delete their own RAMS"
  on public.rams_documents for delete
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Pro users can create RAMS" on public.rams_documents;
create policy "Pro users can create RAMS"
  on public.rams_documents for insert
  to authenticated
  with check (user_id = (select auth.uid()) and public.is_pro());

drop policy if exists "Pro users can update their own RAMS" on public.rams_documents;
create policy "Pro users can update their own RAMS"
  on public.rams_documents for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and public.is_pro());

-- Supabase grants every role full access to new public tables by default.
-- Cut that back to what the policies above need: users can only read billing
-- tables (the Edge Functions write them with the service role).
revoke all on public.customers, public.subscriptions, public.rams_documents from anon;
revoke insert, update, delete, truncate, references, trigger
  on public.customers, public.subscriptions from authenticated;
grant select on public.customers, public.subscriptions to authenticated;
grant select, insert, update, delete on public.rams_documents to authenticated;
grant all on public.customers, public.subscriptions, public.rams_documents to service_role;

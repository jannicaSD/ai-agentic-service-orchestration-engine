-- Supabase schema for AntiGravity Service Orchestrator
-- Tables: profiles, providers, bookings, messages, offers, disputes, reputation_events, agent_traces

-- profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade,
  role text not null check (role in ('customer','provider','admin')),
  name text,
  phone text,
  city text,
  primary key (id)
);

-- providers
create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  auth_user uuid references auth.users,
  name text,
  phone text,
  city text,
  area text,
  categories text[],
  base_rate numeric,
  rating numeric,
  reliability_score numeric,
  cancellation_rate numeric,
  capacity integer default 1,
  availability jsonb,
  tags text[],
  created_at timestamptz default now()
);

-- bookings
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references profiles(id),
  provider_id uuid references providers(id),
  status text not null,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  location jsonb,
  pricing jsonb,
  timeline jsonb,
  created_at timestamptz default now()
);

-- messages (negotiation chat)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  sender_id uuid references profiles(id),
  body text,
  meta jsonb,
  created_at timestamptz default now()
);

-- offers
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  proposer_id uuid references profiles(id),
  total numeric,
  proposed_slot jsonb,
  status text,
  created_at timestamptz default now()
);

-- disputes
create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  raiser_id uuid references profiles(id),
  type text,
  description text,
  status text,
  resolution jsonb,
  created_at timestamptz default now()
);

-- reputation_events
create table if not exists reputation_events (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers(id),
  delta numeric,
  reason text,
  meta jsonb,
  created_at timestamptz default now()
);

-- agent_traces
create table if not exists agent_traces (
  trace_id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  workflow_name text,
  step_name text,
  timestamp timestamptz default now(),
  inputs jsonb,
  outputs jsonb,
  confidence jsonb,
  tool_calls jsonb,
  latency_ms integer,
  meta jsonb
);

-- Example RLS policies (sketch) - enable row level security via Supabase SQL editor
-- enable row level security per table as needed, then add policies

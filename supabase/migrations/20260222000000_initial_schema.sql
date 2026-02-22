-- =============================================================
-- Kushi Mobile App — Database Schema
-- Creates user profiles + onboarding + fasting tables
-- =============================================================

-- 1. Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  email text not null default '',
  fasting_style text not null default '14:10'
    check (fasting_style in ('14:10', '16:8', '12:12')),
  primary_intention text not null default 'energy'
    check (primary_intention in ('digestion', 'weight', 'energy')),
  meditation_goal integer not null default 12,
  streak_days integer not null default 0,
  gut_harmony integer not null default 50,
  has_completed_onboarding boolean not null default false,
  eating_window_start text not null default '11:30 AM',
  eating_window_end text not null default '7:30 PM',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Fasting sessions table
create table if not exists public.fasting_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes integer,
  created_at timestamptz not null default now()
);

-- 3. Enable RLS
alter table public.profiles enable row level security;
alter table public.fasting_sessions enable row level security;

-- 4. RLS Policies — profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 5. RLS Policies — fasting_sessions
create policy "Users can view own fasting sessions"
  on public.fasting_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own fasting sessions"
  on public.fasting_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own fasting sessions"
  on public.fasting_sessions for update
  using (auth.uid() = user_id);

-- 6. Auto-create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

-- Drop if exists to make migration idempotent
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

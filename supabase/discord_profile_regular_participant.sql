alter table public.discord_profiles
  add column if not exists is_regular_participant boolean not null default false;

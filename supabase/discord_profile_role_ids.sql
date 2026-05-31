alter table public.discord_profiles
  add column if not exists discord_role_ids text[] not null default '{}';

alter table public.homepage_settings
  add column if not exists guild_level text default '20';

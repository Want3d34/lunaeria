alter table public.homepage_settings
  add column if not exists layout_config jsonb;

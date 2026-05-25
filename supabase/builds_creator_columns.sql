alter table public.builds
  add column if not exists creator_discord_id text,
  add column if not exists creator_display_name text;

create index if not exists builds_creator_discord_id_idx
  on public.builds (creator_discord_id);

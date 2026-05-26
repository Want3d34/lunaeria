create table if not exists public.reglement_validations (
  id uuid primary key default gen_random_uuid(),
  discord_user_id text not null unique,
  discord_username text,
  validated_at timestamptz not null default now()
);

alter table public.reglement_validations enable row level security;

create policy "Authenticated users can read regulation validations"
  on public.reglement_validations
  for select
  to authenticated
  using (true);

create policy "Authenticated users can create regulation validations"
  on public.reglement_validations
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update regulation validations"
  on public.reglement_validations
  for update
  to authenticated
  using (true)
  with check (true);

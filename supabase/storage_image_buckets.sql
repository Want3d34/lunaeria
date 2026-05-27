insert into storage.buckets (id, name, public)
values
  ('builds', 'builds', true)
on conflict (id) do update
set public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read builds images'
  ) then
    create policy "Public read builds images"
    on storage.objects for select
    using (bucket_id = 'builds');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated upload builds images'
  ) then
    create policy "Authenticated upload builds images"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'builds');
  end if;
end $$;

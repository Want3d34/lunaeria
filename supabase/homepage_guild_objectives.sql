alter table public.homepage_settings
  add column if not exists guild_objective_title text default 'Objectifs de guilde',
  add column if not exists guild_objective_text text default 'Préparer les prochaines sorties, renforcer l''entraide et faire progresser Lunaeria ensemble.',
  add column if not exists guild_objective_progress text default 'En cours';

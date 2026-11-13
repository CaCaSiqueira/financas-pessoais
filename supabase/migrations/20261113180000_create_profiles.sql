-- Perfis de usuário: 1:1 com auth.users, criado automaticamente no primeiro login.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text check (char_length(nome) <= 120),
  avatar_url text check (char_length(avatar_url) <= 2048),
  moeda char(3) not null default 'BRL' check (moeda ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil do usuário (1:1 com auth.users).';

-- RLS obrigatório: cada usuário só enxerga e altera o próprio perfil.
alter table public.profiles enable row level security;

create policy "profiles: ler o próprio"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: atualizar o próprio"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Sem policies de insert/delete: o perfil nasce pelo trigger e morre com o auth.users.
-- Privilégios mínimos: anon não acessa; authenticated só lê e altera colunas editáveis.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (nome, avatar_url, moeda) on table public.profiles to authenticated;

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria o perfil no primeiro login (dados vindos do Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 120),
    left(coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'), 2048)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

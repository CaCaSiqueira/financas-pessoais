-- Teste de RLS da tabela public.profiles.
--
-- Cria dois usuários temporários (A e B), age como A e tenta ler/alterar o perfil de B.
-- Tudo roda em um único bloco DO que SEMPRE termina com uma exceção, garantindo rollback:
-- nenhum dado fica no banco. O resultado vem na mensagem:
--   RLS_OK: ...       -> todas as verificações passaram
--   RLS_FALHOU: ...   -> alguma verificação falhou (detalhes na mensagem)
--
-- Rodar no projeto remoto:
--   npx supabase db query --remote --yes -f supabase/tests/profiles_rls.sql

do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  n int;
  falhas text := '';
  log text := '';
begin
  insert into auth.users (id, email, aud, role, raw_user_meta_data)
  values
    (a, 'rls-a@teste.invalid', 'authenticated', 'authenticated', '{"full_name":"Usuária A"}'),
    (b, 'rls-b@teste.invalid', 'authenticated', 'authenticated', '{"full_name":"Usuária B"}');

  -- Trigger criou os perfis com o nome vindo do provedor e moeda padrão.
  select count(*) into n from public.profiles where id in (a, b) and moeda = 'BRL';
  log := log || 'trigger=' || n || ' ';
  if n <> 2 then falhas := falhas || 'trigger não criou os 2 perfis; '; end if;

  -- Age como a usuária A.
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  set local role authenticated;

  select count(*) into n from public.profiles where id = b;
  log := log || 'ler_perfil_de_B=' || n || ' ';
  if n <> 0 then falhas := falhas || 'A leu o perfil de B; '; end if;

  select count(*) into n from public.profiles;
  log := log || 'perfis_visiveis=' || n || ' ';
  if n <> 1 then falhas := falhas || 'A enxerga perfis além do próprio; '; end if;

  update public.profiles set nome = 'invadido' where id = b;
  get diagnostics n = row_count;
  log := log || 'alterar_B=' || n || ' ';
  if n <> 0 then falhas := falhas || 'A alterou o perfil de B; '; end if;

  update public.profiles set nome = 'Nome novo' where id = a;
  get diagnostics n = row_count;
  log := log || 'alterar_proprio=' || n || ' ';
  if n <> 1 then falhas := falhas || 'A não conseguiu alterar o próprio perfil; '; end if;

  begin
    update public.profiles set id = b where id = a;
    falhas := falhas || 'A conseguiu trocar o id do perfil; ';
    log := log || 'trocar_id=PERMITIDO ';
  exception when insufficient_privilege then
    log := log || 'trocar_id=negado ';
  end;

  begin
    insert into public.profiles (id) values (gen_random_uuid());
    falhas := falhas || 'A conseguiu inserir perfil; ';
    log := log || 'inserir=PERMITIDO ';
  exception when insufficient_privilege then
    log := log || 'inserir=negado ';
  end;

  begin
    delete from public.profiles where id = a;
    falhas := falhas || 'A conseguiu apagar perfil; ';
    log := log || 'apagar=PERMITIDO ';
  exception when insufficient_privilege then
    log := log || 'apagar=negado ';
  end;

  reset role;

  -- Visitante sem login (anon) não acessa a tabela.
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;
  begin
    select count(*) into n from public.profiles;
    falhas := falhas || 'anon conseguiu ler profiles; ';
    log := log || 'anon_ler=PERMITIDO ';
  exception when insufficient_privilege then
    log := log || 'anon_ler=negado ';
  end;
  reset role;

  if falhas <> '' then
    raise exception 'RLS_FALHOU: % | %', falhas, log;
  end if;
  raise exception 'RLS_OK: %', log;
end
$$;

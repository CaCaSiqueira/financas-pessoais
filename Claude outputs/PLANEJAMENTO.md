# Planejamento Inicial — Sistema de Controle Financeiro Pessoal

> Versão 0.1 · 13/11/2026 · Status: proposta para aprovação

---

## 1. Objetivo

Aplicação web **mobile first**, totalmente responsiva e instalável como app (PWA), para controle financeiro pessoal, com **login via Google**, construída com **ferramentas gratuitas** e infraestrutura configurada de forma automatizada (Claude executa via CLI/API; você só faz logins e aprovações).

### Premissas

- Uso **pessoal e não comercial** (requisito do plano gratuito da Vercel).
- Entrega rápida: MVP funcional em produção antes de evoluir.
- Boas práticas desde o dia 1: tipagem forte, testes, CI, migrations versionadas, segurança no banco.

---

## 2. Stack recomendada

| Camada       | Escolha                                                                                        | Por quê                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Linguagem    | **TypeScript** (front e back)                                                                  | Uma linguagem só, tipos ponta a ponta, menos troca de contexto                    |
| Framework    | **Next.js 16** (App Router, Server Components, Server Actions)                                 | Front + back no mesmo projeto, deploy nativo na Vercel, zero configuração         |
| UI           | **Tailwind CSS v4 + shadcn/ui** (Radix)                                                        | Mobile first natural, componentes acessíveis, código no repositório (sem lock-in) |
| Banco        | **Supabase (PostgreSQL)**                                                                      | Postgres real e open source, migrations via CLI, rota de saída garantida          |
| Autenticação | **Supabase Auth + Google OAuth**                                                               | Login Google pronto, sessão via cookies SSR (`@supabase/ssr`)                     |
| Autorização  | **Row Level Security (RLS)** no Postgres                                                       | Cada usuário só enxerga seus dados — a regra mora no banco, não só no código      |
| Validação    | **Zod** + React Hook Form                                                                      | Mesmo schema valida formulário e Server Action                                    |
| Gráficos     | **Recharts**                                                                                   | Leve, responsivo, suficiente para dashboards financeiros                          |
| Testes       | **Vitest** (unidade) + **Playwright** (E2E mobile/desktop)                                     | Rápidos, padrão de mercado                                                        |
| Qualidade    | ESLint + Prettier + Husky/lint-staged + Conventional Commits                                   | Padrão automático em todo commit                                                  |
| CI/CD        | **GitHub Actions** (lint, typecheck, testes) + **Vercel** (preview por PR, produção na `main`) | Deploy automático a cada push                                                     |
| PWA          | Manifest + Service Worker (Serwist)                                                            | "Instalar" no celular como app                                                    |

### Por que não um back-end separado (NestJS, Spring, .NET etc.)?

Para a urgência e o escopo (uso pessoal), um back-end separado adiciona outro deploy, outro servidor e outra conta gratuita com limites — sem ganho real. Next.js (Server Actions/Route Handlers) + RLS no Postgres cobre a camada de back-end com segurança. A arquitetura em camadas (abaixo) mantém a porta aberta para extrair uma API depois.

### Alternativa 100% open source (caso queira evitar Vercel/Supabase)

SvelteKit ou Next.js + **Cloudflare Pages** + **Neon** (Postgres) + **Auth.js**. Funciona, mas exige mais configuração manual de auth — não recomendo para este prazo.

---

## 3. Limites do plano gratuito (verificados em nov/2026)

**Supabase Free** — 2 projetos ativos, 500 MB de banco, 1 GB de arquivos, 5 GB de tráfego, 50 mil usuários ativos/mês, sem cartão.

- ⚠️ **Projetos pausam após 7 dias sem atividade no banco.** Mitigação: um job agendado (GitHub Actions ou Vercel Cron, diário) fazendo uma consulta leve. Os dados não se perdem na pausa, mas o app fica fora até reativar.
- ⚠️ O plano Free não lista backups automáticos → **job semanal de `pg_dump`** via GitHub Actions salvando como artefato.

**Vercel Hobby** — gratuito, 1 usuário, uso **pessoal e não comercial** apenas. Cotas mensais (tráfego, execuções de função, minutos de build) muito acima do necessário para uso pessoal. Se a cota estourar, o recurso fica bloqueado até o ciclo de 30 dias.

> Conclusão: para uso pessoal, o custo é **R$ 0**. Se um dia virar produto comercial, migrar para Vercel Pro (US$ 20/mês) e Supabase Pro (US$ 25/mês).

---

## 4. Arquitetura

```
src/
  app/                    # rotas (App Router) — só composição de tela
    (auth)/login/
    (app)/dashboard/ lancamentos/ contas/ categorias/ orcamentos/ relatorios/
  features/<dominio>/     # organização por funcionalidade (vertical slices)
    components/           # UI do domínio
    actions.ts            # Server Actions (entrada/validação Zod)
    service.ts            # regras de negócio (puras, testáveis)
    repository.ts         # acesso a dados (Supabase)
    schema.ts             # tipos e validação
  lib/supabase/           # clientes server/browser/middleware
  components/ui/          # shadcn/ui
supabase/
  migrations/             # SQL versionado (fonte da verdade do schema)
  seed.sql
tests/ (unit, e2e)
```

Princípios: regras de negócio isoladas de framework; acesso a dados atrás de repositório; tipos do banco gerados automaticamente (`supabase gen types`); nenhuma credencial no código (variáveis de ambiente).

---

## 5. Modelo de dados (MVP)

| Tabela                        | Campos principais                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `profiles`                    | id (= auth.users), nome, moeda padrão                                                                                  |
| `accounts` (contas/carteiras) | id, user_id, nome, tipo (corrente, poupança, cartão, dinheiro, investimento), saldo_inicial                            |
| `categories`                  | id, user_id, nome, tipo (receita/despesa), cor, ícone, parent_id                                                       |
| `transactions`                | id, user_id, account_id, category_id, tipo, valor, data, descrição, status (pago/pendente), transfer_id, recurrence_id |
| `recurrences`                 | id, user_id, regra (mensal, semanal…), próxima_data                                                                    |
| `budgets`                     | id, user_id, category_id, mês, valor_limite                                                                            |

Decisões técnicas:

- **Dinheiro em centavos (`bigint`)** — nunca `float`.
- Transferência entre contas = 2 lançamentos ligados por `transfer_id`.
- Saldos calculados por **view** (sem saldo duplicado/desatualizado).
- **RLS em todas as tabelas**: `user_id = auth.uid()`.
- `created_at`/`updated_at` via trigger; índices em (user_id, data).

---

## 6. Escopo

### MVP (entrega 1)

1. Login/logout com Google; criação automática do perfil + categorias padrão.
2. CRUD de contas, categorias e lançamentos (receita, despesa, transferência).
3. Dashboard: saldo total, receitas × despesas do mês, gastos por categoria, últimos lançamentos.
4. Filtros por mês, conta e categoria.
5. Layout mobile first: navegação inferior no celular, sidebar no desktop, botão flutuante "+ lançamento".
6. Tema claro/escuro.

### Entrega 2

Orçamentos por categoria com alertas · lançamentos recorrentes e parcelados · cartão de crédito (fatura/fechamento) · PWA instalável.

### Entrega 3

Importação de extrato (OFX/CSV) · exportação CSV/Excel · relatórios anuais · metas de economia.

---

## 7. Divisão do trabalho: o que Claude faz × o que você faz

| Etapa        | Claude (automático)                                                                            | Você (manual)                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| GitHub       | Cria repositório (`gh repo create`), branches, Actions, proteção da `main`                     | `gh auth login` (login no navegador)                                                                                       |
| Supabase     | Cria projeto, aplica migrations, RLS, gera tipos, configura provider Google via Management API | Login (`supabase login`) e criar/escolher organização                                                                      |
| Google OAuth | Prepara todos os valores (URLs de callback, origens) e guia passo a passo                      | **Criar o OAuth Client ID no Google Cloud Console** e colar Client ID/Secret (~5 min — o Google não oferece CLI para isso) |
| Vercel       | Liga o projeto ao GitHub, cadastra variáveis de ambiente, faz deploy                           | `vercel login`                                                                                                             |
| Código       | 100% — scaffolding, features, testes, CI                                                       | Revisar PRs e testar no celular                                                                                            |

**Total estimado de intervenção manual: ~15 minutos**, concentrados no início.

**Onde executar:** no **Claude Code** no seu computador (que já tem acesso ao terminal, Git e navegador para os logins). A ligação desta conversa com seu computador não está respondendo no momento; se ela voltar, consigo executar daqui também.

---

## 8. Cronograma sugerido

| Fase                | Conteúdo                                                                                   | Duração     |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| 0 — Setup           | Repositório, Next.js, Supabase, Google OAuth, Vercel, CI, deploy "hello world" autenticado | ½ dia       |
| 1 — Núcleo          | Schema + RLS, contas, categorias, lançamentos                                              | 1 dia       |
| 2 — Dashboard       | Indicadores, gráficos, filtros, polimento mobile                                           | 1 dia       |
| 3 — Qualidade       | Testes E2E, keep-alive e backup, revisão de segurança                                      | ½ dia       |
| **MVP em produção** |                                                                                            | **~3 dias** |

---

## 9. Riscos

| Risco                                        | Mitigação                                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Pausa do Supabase por inatividade            | Cron diário de keep-alive                                                                              |
| Ausência de backup no plano Free             | `pg_dump` semanal automatizado                                                                         |
| Vazamento de dados entre usuários            | RLS + teste automatizado de isolamento                                                                 |
| Tela de consentimento Google em modo "teste" | Adicionar seu e-mail como usuário de teste, ou publicar o app (escopos básicos não exigem verificação) |
| Limites de cota gratuitos                    | Uso pessoal fica muito abaixo; monitorar pelos painéis                                                 |

---

## 10. Decisões pendentes (preciso da sua resposta)

1. **Usuários:** só você, ou família também (contas compartilhadas)?
2. **Contextos/carteiras separados** (ex.: Pessoal × Profissional × Canais) desde o MVP?
3. **Aproveitar algo do FinControl** que você já tem, ou começar do zero?
4. **Cartão de crédito com fatura** entra no MVP ou na entrega 2?
5. **Nome do projeto/repositório** e domínio (padrão gratuito: `nome.vercel.app`).
6. Aprova a stack **Next.js + Supabase + Vercel**?

# CLAUDE.md — financas-pessoais

Controle financeiro pessoal, uso individual, não comercial.

## Stack

- Next.js 16 (App Router, Server Components, Server Actions)
- TypeScript em modo strict
- Tailwind CSS v4 + shadcn/ui
- Supabase (Postgres + Auth Google + RLS) via `@supabase/ssr`
- Zod + React Hook Form
- Recharts
- Vitest (unitários) + Playwright (e2e)
- Deploy na Vercel (plano Hobby); CI no GitHub Actions
- **Somente ferramentas gratuitas.**

## Arquitetura

- `src/app` = rotas e composição de tela **apenas**.
- `src/features/<dominio>/`
  - `components/`
  - `actions.ts` — Server Actions
  - `service.ts` — regras de negócio (puras e testáveis)
  - `repository.ts` — único lugar com acesso a dados
  - `schema.ts` — schemas Zod
- Regras de negócio ficam em `service.ts`; acesso a dados somente em `repository.ts`.
- `supabase/migrations` é a fonte da verdade do schema; tipos gerados com `supabase gen types`.

## Regras

- **Mobile first:** projetar para 360px primeiro; navegação inferior no mobile, sidebar a partir de `md`.
- **Dinheiro sempre em centavos** (bigint / number inteiro); formatar com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- **RLS obrigatório** em toda tabela (`user_id = auth.uid()`); nunca usar `service_role` no cliente.
- **Validação com Zod no servidor** em toda Server Action.
- **Nenhum segredo no código:** usar `.env.local` e manter `.env.example` atualizado.
- **Git:** Conventional Commits; uma branch por sprint (`feat/sprint-N-...`); PR com descrição.
- **Antes de concluir qualquer tarefa:** rodar lint, typecheck e testes, e corrigir falhas.
- **Interface em português do Brasil.**
- **Acessibilidade:** labels em todos os campos, foco visível, contraste AA.
- **Ações manuais / login:** quando precisar de login da usuária ou de ação manual, parar, explicar em passos numerados e esperar ela dizer "feito".

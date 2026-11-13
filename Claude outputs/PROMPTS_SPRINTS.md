# Roteiro de Prompts por Sprint — Finanças Pessoais (Claude Code)

> Stack aprovada: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + Supabase (Postgres, Auth Google, RLS) + Vercel + GitHub Actions.
> Formato: 6 sprints curtas (~½ dia cada). Cada sprint = 1 branch + 1 PR. Cole os prompts **na ordem**, um por vez, e só avance quando a "Definição de Pronto" (DoD) estiver ok.

---

## Como usar

1. Crie uma pasta vazia (ex.: `C:\dev\financas-pessoais`), abra o terminal nela e rode `claude`.
2. Cole o **Prompt 0** (contrato do projeto) uma única vez — ele vira o `CLAUDE.md` e vale para todas as sprints.
3. Para cada sprint: cole o prompt de abertura → acompanhe → cole o prompt de revisão → faça merge.
4. Sempre que o Claude pedir login (GitHub, Supabase, Vercel, Google), faça e responda "feito".
5. Dica: use **Shift+Tab (modo plano)** antes dos prompts grandes para aprovar o plano antes da execução.

---

## Prompt 0 — Contrato do projeto (CLAUDE.md)

```
Crie o arquivo CLAUDE.md na raiz deste projeto com as regras abaixo e siga-as em todas as tarefas futuras.

PROJETO: "financas-pessoais" — controle financeiro pessoal, uso individual, não comercial.
STACK: Next.js 16 (App Router, Server Components, Server Actions), TypeScript strict, Tailwind CSS v4, shadcn/ui, Supabase (Postgres + Auth Google + RLS) via @supabase/ssr, Zod, React Hook Form, Recharts, Vitest, Playwright. Deploy na Vercel (Hobby), CI no GitHub Actions. Somente ferramentas gratuitas.

ARQUITETURA:
- src/app = rotas e composição de tela apenas.
- src/features/<dominio>/{components, actions.ts, service.ts, repository.ts, schema.ts}.
- Regras de negócio em service.ts (puras e testáveis); acesso a dados só em repository.ts.
- supabase/migrations = fonte da verdade do schema; tipos gerados com `supabase gen types`.

REGRAS:
- Mobile first: projetar para 360px primeiro; navegação inferior no mobile, sidebar a partir de md.
- Dinheiro sempre em centavos (bigint/number inteiro); formatar com Intl pt-BR / BRL.
- RLS obrigatório em toda tabela (user_id = auth.uid()); nunca usar service_role no cliente.
- Validação com Zod no servidor em toda Server Action.
- Nenhum segredo no código; usar .env.local e manter .env.example atualizado.
- Conventional Commits; uma branch por sprint (feat/sprint-N-...); PR com descrição.
- Antes de concluir qualquer tarefa: rodar lint, typecheck e testes, e corrigir falhas.
- Interface em português do Brasil. Acessibilidade: labels, foco visível, contraste AA.
- Quando precisar de login meu ou ação manual, pare, explique em passos numerados e espere eu dizer "feito".

Depois de criar o CLAUDE.md, apenas confirme e aguarde a Sprint 1.
```

---

## Sprint 1 — Fundação e infraestrutura (meta: app "olá" no ar com CI)

**Prompt 1.1 — Setup**

```
Sprint 1, parte 1. Verifique se tenho instalados: Node 20+, git, gh, Supabase CLI e Vercel CLI; instale o que faltar (via npm quando possível) e me diga se algo exigir ação manual.
Depois:
1. Crie o projeto Next.js 16 nesta pasta (TS, Tailwind, ESLint, App Router, src/, alias @/*).
2. Configure Prettier, Husky + lint-staged, commitlint (Conventional Commits), scripts: dev, build, lint, typecheck, test, test:e2e, format.
3. Instale e inicialize shadcn/ui (tema neutro, modo claro/escuro com next-themes).
4. Configure Vitest e Playwright (projetos: Pixel 7 e Desktop Chrome) com um teste de exemplo cada.
5. Crie a estrutura de pastas do CLAUDE.md e um .env.example.
6. git init, primeiro commit, e crie o repositório privado "financas-pessoais" no meu GitHub com `gh repo create` (peça meu login se necessário) e faça push.
```

**Prompt 1.2 — Supabase + Google + Vercel**

```
Sprint 1, parte 2.
1. Supabase: faça `supabase login` (eu autorizo), crie o projeto "financas-pessoais" na região São Paulo (sa-east-1) com senha forte gerada e salva só no .env.local, e rode `supabase link`.
2. Google OAuth: me dê o passo a passo exato para criar o OAuth Client (tipo Web) no Google Cloud Console, já com a "Authorized redirect URI" do Supabase preenchida e as origens corretas (localhost:3000 e o domínio da Vercel). Espere eu colar Client ID e Secret.
3. Configure o provider Google no Supabase pela Management API (ou me oriente se não for possível) e defina Site URL e Redirect URLs (localhost e Vercel).
4. Vercel: `vercel login`, `vercel link`, conecte ao repositório do GitHub e cadastre as variáveis de ambiente (production, preview, development).
5. Crie .github/workflows/ci.yml: install, lint, typecheck, test, build em todo PR e push na main.
6. Faça deploy e me passe a URL de produção.
```

**Prompt 1.3 — Revisão**

```
Revise a Sprint 1: confirme que CI passa no GitHub, que o deploy está acessível, que nenhum segredo foi commitado (verifique o histórico) e que .env.example está completo. Liste pendências. Abra o PR da sprint e faça merge se estiver tudo verde.
```

**DoD:** URL da Vercel no ar · CI verde · nenhum segredo no repo.

---

## Sprint 2 — Autenticação e layout base (meta: login Google + casca do app)

**Prompt 2.1**

```
Sprint 2 (branch feat/sprint-2-auth-layout).
1. Implemente auth com @supabase/ssr: clientes server/browser, middleware (proxy) que renova sessão e protege as rotas do grupo (app); rota /auth/callback; página /login com botão "Entrar com Google"; logout.
2. Migration: tabela profiles (id = auth.users.id, nome, avatar_url, moeda default 'BRL', timestamps) com RLS e trigger que cria o perfil no primeiro login.
3. Layout mobile first: header compacto, navegação inferior com 5 itens (Início, Lançamentos, +, Contas, Mais) no mobile; sidebar a partir de md. Botão central "+" abre o formulário de novo lançamento (placeholder por enquanto).
4. Páginas vazias com estados "vazio" amigáveis: dashboard, lancamentos, contas, categorias, orcamentos, relatorios, configuracoes.
5. Alternador de tema claro/escuro.
6. Testes: unitário do helper de sessão; E2E que garante redirecionamento para /login quando deslogado (mobile e desktop).
Aplique a migration no Supabase remoto, gere os tipos e faça deploy.
```

**Prompt 2.2 — Revisão**

```
Revise a Sprint 2 como um revisor sênior: segurança da sessão, rotas protegidas, RLS de profiles (tente ler o perfil de outro usuário num teste SQL), acessibilidade da navegação e layout em 360px, 768px e 1280px (tire screenshots com Playwright e me mostre). Corrija o que encontrar, abra o PR e faça merge.
```

**DoD:** consigo entrar com minha conta Google em produção, no celular.

---

## Sprint 3 — Núcleo de dados: contas e categorias

**Prompt 3.1**

```
Sprint 3 (branch feat/sprint-3-contas-categorias).
1. Migrations com RLS, índices e triggers de updated_at:
   - accounts: id, user_id, nome, tipo (corrente|poupanca|carteira|cartao|investimento), saldo_inicial_centavos bigint, cor, icone, arquivada bool.
   - categories: id, user_id, nome, tipo (receita|despesa), cor, icone, parent_id (subcategoria), arquivada.
   - Função que cria categorias padrão brasileiras (Moradia, Alimentação, Transporte, Saúde, Educação, Lazer, Assinaturas, Salário, Freelance, Investimentos, Outros) no primeiro login.
2. Feature "contas": listagem em cards (mobile) / tabela (desktop), criar, editar, arquivar — formulário em Drawer no mobile e Dialog no desktop.
3. Feature "categorias": mesma abordagem, com agrupamento receita/despesa e seletor de cor/ícone.
4. Utilitários de dinheiro (src/lib/money.ts): parse de "1.234,56" para centavos, formatação BRL, máscara de input. Testes unitários completos com casos de borda.
5. Teste automatizado de isolamento RLS: usuário A não lê nem altera dados do usuário B.
Aplique migrations, gere tipos, rode tudo e faça deploy.
```

**Prompt 3.2 — Revisão**

```
Revise a Sprint 3 (código, migrations, RLS, testes, UX mobile). Corrija, abra o PR e faça merge.
```

**DoD:** crio/edito contas e categorias pelo celular; testes de RLS e money passando.

---

## Sprint 4 — Lançamentos (coração do sistema)

**Prompt 4.1**

```
Sprint 4 (branch feat/sprint-4-lancamentos).
1. Migration transactions: id, user_id, account_id, category_id (null em transferência), tipo (receita|despesa|transferencia), valor_centavos bigint > 0, data, descricao, observacao, status (pago|pendente), transfer_group_id, timestamps. Índices (user_id, data desc), (user_id, account_id). RLS.
2. Transferência = dois registros vinculados por transfer_group_id, criados/excluídos atomicamente (função SQL/RPC).
3. View account_balances: saldo atual por conta = saldo inicial + lançamentos pagos (security_invoker = on).
4. Tela de lançamentos: lista agrupada por dia, com totais do dia; filtros por mês (seletor com setas), conta, categoria, tipo e busca por texto; paginação infinita.
5. Formulário rápido de novo lançamento (botão "+"): valor primeiro com teclado numérico (inputmode="decimal"), tipo em segmented control, conta, categoria, data (padrão hoje), descrição. Validação Zod. Otimizado para 1 mão no celular.
6. Editar, duplicar e excluir (com confirmação e desfazer via toast).
7. Testes: service de transações e transferências (unitário) e E2E do fluxo criar → editar → excluir no mobile.
Aplique, gere tipos, teste e faça deploy.
```

**Prompt 4.2 — Revisão**

```
Revise a Sprint 4 com foco em consistência de saldos (crie cenários de teste com transferências e exclusões), performance das consultas (EXPLAIN nas principais) e UX do formulário rápido. Corrija, abra o PR e faça merge.
```

**DoD:** registro um gasto em menos de 10 segundos no celular; saldos batem.

---

## Sprint 5 — Dashboard e relatórios

**Prompt 5.1**

```
Sprint 5 (branch feat/sprint-5-dashboard).
1. Dashboard (Server Components, consultas agregadas no Postgres via views/RPC):
   - Cards: saldo total, receitas do mês, despesas do mês, resultado do mês (com variação vs mês anterior).
   - Gráfico de rosca: despesas por categoria no mês.
   - Gráfico de barras: receitas x despesas dos últimos 6 meses.
   - Saldo por conta e últimos 5 lançamentos.
   - Seletor de mês global.
2. Página de relatórios: evolução mensal do ano, ranking de categorias, exportar CSV do período filtrado.
3. Skeletons de carregamento, estados vazios e responsividade (cards em carrossel horizontal no mobile).
4. Testes unitários das agregações e E2E do dashboard.
Deploy ao final.
```

**Prompt 5.2 — Revisão**

```
Revise a Sprint 5: confira os números do dashboard contra consultas SQL diretas, acessibilidade dos gráficos (texto alternativo/tabela), e Lighthouse mobile (meta ≥ 90 em performance e acessibilidade). Corrija, abra o PR e faça merge.
```

**DoD:** dashboard confiável e rápido no celular. **→ MVP concluído.**

---

## Sprint 6 — Produção robusta (PWA, recorrências, orçamentos, operação)

**Prompt 6.1**

```
Sprint 6 (branch feat/sprint-6-producao).
1. PWA com Serwist: manifest, ícones, tela de instalação, funcionamento offline básico das telas já visitadas.
2. Orçamentos: tabela budgets (categoria, mês, limite_centavos) com RLS; tela com barras de progresso e alerta visual a 80% e 100%.
3. Recorrências e parcelamentos: tabela recurrences; gerar lançamentos pendentes futuros; compra parcelada em N vezes.
4. Operação:
   - GitHub Action diária de keep-alive (consulta leve ao Supabase) para evitar a pausa do plano Free.
   - GitHub Action semanal de backup com pg_dump salvo como artefato (retenção 30 dias), usando secrets do repositório.
   - Página /configuracoes com exportação completa dos meus dados (JSON/CSV) e exclusão de conta.
5. Headers de segurança (CSP, etc.) no next.config e revisão de dependências (npm audit).
6. README completo: arquitetura, como rodar local, variáveis, deploy, backup e restauração.
Deploy ao final.
```

**Prompt 6.2 — Revisão final**

```
Faça uma auditoria final do projeto como se fosse um tech lead: segurança (RLS em todas as tabelas, segredos, headers), qualidade (cobertura de testes nos services), performance, acessibilidade e UX mobile. Gere um relatório curto com o que está ok e o que recomenda para o backlog. Corrija itens críticos, abra o PR, faça merge e confirme a URL de produção.
```

**DoD:** app instalável no celular, backup e keep-alive rodando, README pronto.

---

## Backlog (sprints futuras, se quiser)

| Item                         | Prompt curto                                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Cartão de crédito com fatura | "Implemente cartões com dia de fechamento/vencimento, fatura mensal e pagamento de fatura como transferência." |
| Importar extrato             | "Importe OFX/CSV de bancos brasileiros com pré-visualização, deduplicação e sugestão de categoria."            |
| Metas de economia            | "Crie metas com valor-alvo, prazo e aporte mensal sugerido."                                                   |
| Carteiras/contextos          | "Adicione contextos (Pessoal, Profissional…) que filtram todo o app."                                          |

---

## Prompts utilitários (use quando precisar)

- **Destravar erro:** `Leia o erro abaixo, encontre a causa raiz (não só o sintoma), corrija e adicione um teste que evite regressão: <cole o erro>`
- **Retomar sessão:** `Leia CLAUDE.md, o git log e os PRs abertos; me diga em que sprint estamos e qual o próximo passo.`
- **Ajuste visual:** `Na tela X, em 360px, <descreva o problema>. Corrija mantendo o padrão do design system e mostre screenshot antes/depois.`
- **Fechar o dia:** `Faça commit do que está pronto, atualize o PR com um resumo do progresso e liste o que falta nesta sprint.`

---

## Cronograma

| Sprint    | Entrega                 | Duração                 |
| --------- | ----------------------- | ----------------------- |
| 1         | Infra + CI + deploy     | ½ dia                   |
| 2         | Login Google + layout   | ½ dia                   |
| 3         | Contas + categorias     | ½ dia                   |
| 4         | Lançamentos             | 1 dia                   |
| 5         | Dashboard (MVP pronto)  | ½ dia                   |
| 6         | PWA, orçamentos, backup | 1 dia                   |
| **Total** |                         | **~4 dias** (MVP em ~3) |

# Features

Cada domínio da aplicação vive em `src/features/<dominio>/`:

```
src/features/<dominio>/
  components/     # componentes React do domínio
  actions.ts      # Server Actions ("use server") — validam a entrada com Zod
  service.ts      # regras de negócio puras e testáveis (sem I/O)
  repository.ts   # único ponto de acesso a dados (Supabase)
  schema.ts       # schemas Zod e tipos derivados
```

Fluxo: `actions.ts` → valida com `schema.ts` → chama `service.ts` → persiste via `repository.ts`.
`src/app` apenas compõe telas a partir dessas peças.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { decideSessionRoute } from "@/features/auth/session";
import { publicEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

/**
 * Renova a sessão do Supabase a cada requisição e aplica a proteção otimista de rotas.
 * A autorização real dos dados é feita pelo RLS no Postgres.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          for (const [key, value] of Object.entries(headers ?? {})) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // Não coloque código entre createServerClient e getClaims: getClaims valida o JWT
  // (assinatura) e dispara a renovação do token quando necessário.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const { pathname, search } = request.nextUrl;
  const decision = decideSessionRoute(pathname, search, isAuthenticated);

  if (decision.action === "redirect") {
    const url = request.nextUrl.clone();
    const target = new URL(decision.to, request.url);
    url.pathname = target.pathname;
    url.search = target.search;
    const redirect = NextResponse.redirect(url);
    // Preserva os cookies de sessão renovados no redirecionamento.
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }

  return response;
}

import { NextResponse, type NextRequest } from "next/server";

import { getSafeRedirectPath, LOGIN_PATH } from "@/features/auth/session";
import { createClient } from "@/lib/supabase/server";

/** Troca o código OAuth (PKCE) por uma sessão e redireciona para um caminho interno seguro. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL(`${LOGIN_PATH}?error=auth`, origin));
}

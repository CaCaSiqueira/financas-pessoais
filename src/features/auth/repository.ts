import "server-only";

import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
  nome: string | null;
  avatarUrl: string | null;
};

/**
 * Usuário autenticado validado no servidor do Supabase (getUser), com o perfil.
 * Retorna null quando não há sessão válida.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    nome: profile?.nome ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };
}

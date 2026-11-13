"use server";

import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/features/auth/session";
import { createClient } from "@/lib/supabase/server";

/** Encerra a sessão (revoga o refresh token no Supabase e limpa os cookies). */
export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}

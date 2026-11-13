import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/repository";
import { LOGIN_PATH } from "@/features/auth/session";

import { UserMenuDropdown } from "./user-menu-dropdown";

/** Server Component: valida a sessão no servidor (defesa em profundidade além do proxy). */
export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  return <UserMenuDropdown nome={user.nome} email={user.email} avatarUrl={user.avatarUrl} />;
}

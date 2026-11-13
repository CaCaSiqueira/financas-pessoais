import {
  ArrowLeftRight,
  ChartPie,
  House,
  Menu,
  PiggyBank,
  Settings,
  Tags,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Itens da sidebar (md+), na ordem de exibição. */
export const sidebarItems: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: House },
  { href: "/lancamentos", label: "Lançamentos", icon: ArrowLeftRight },
  { href: "/contas", label: "Contas", icon: Wallet },
  { href: "/categorias", label: "Categorias", icon: Tags },
  { href: "/orcamentos", label: "Orçamentos", icon: PiggyBank },
  { href: "/relatorios", label: "Relatórios", icon: ChartPie },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

/** Itens que, no mobile, ficam dentro de "Mais". */
export const moreItems: NavItem[] = sidebarItems.filter((item) =>
  ["/categorias", "/orcamentos", "/relatorios", "/configuracoes"].includes(item.href),
);

export const moreItem: NavItem = { href: "/mais", label: "Mais", icon: Menu };

/** Itens laterais da navegação inferior; o botão "+" fica no centro. */
export const bottomNavLeft: NavItem[] = [sidebarItems[0], sidebarItems[1]];
export const bottomNavRight: NavItem[] = [sidebarItems[2], moreItem];

export function isActivePath(pathname: string, href: string): boolean {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  // "Mais" fica ativo nas páginas que ele agrupa.
  if (href === moreItem.href) {
    return moreItems.some((item) => isActivePath(pathname, item.href));
  }
  return false;
}

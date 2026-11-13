"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { bottomNavLeft, bottomNavRight, isActivePath, type NavItem } from "../nav-items";
import { NewTransactionSheet } from "./new-transaction-sheet";

function BottomNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;
  return (
    <li className="flex-1">
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon aria-hidden="true" className={cn("size-5", active && "stroke-[2.5]")} />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch px-2">
        {bottomNavLeft.map((item) => (
          <BottomNavLink key={item.href} item={item} pathname={pathname} />
        ))}
        <li className="flex flex-1 items-center justify-center">
          <NewTransactionSheet
            trigger={
              <button
                type="button"
                aria-label="Novo lançamento"
                className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Plus aria-hidden="true" className="size-6" />
              </button>
            }
          />
        </li>
        {bottomNavRight.map((item) => (
          <BottomNavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </ul>
    </nav>
  );
}

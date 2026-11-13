"use client";

import { Plus, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { isActivePath, sidebarItems } from "../nav-items";
import { NewTransactionSheet } from "./new-transaction-sheet";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r bg-sidebar px-3 py-4 text-sidebar-foreground md:flex">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-lg px-2 py-1 font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet aria-hidden="true" className="size-4" />
        </span>
        Finanças Pessoais
      </Link>

      <NewTransactionSheet
        side="right"
        trigger={
          <Button className="h-10 w-full justify-start gap-2">
            <Plus aria-hidden="true" />
            Novo lançamento
          </Button>
        }
      />

      <nav aria-label="Navegação principal">
        <ul className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

import { ChevronRight, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { signOut } from "@/features/auth/actions";
import { moreItems } from "@/features/navigation/nav-items";

export const metadata: Metadata = { title: "Mais" };

export default function MaisPage() {
  return (
    <>
      <PageHeader title="Mais" />
      <nav aria-label="Outras seções">
        <ul className="divide-y overflow-hidden rounded-xl border">
          {moreItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-14 items-center gap-3 px-4 outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
                >
                  <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <form action={signOut}>
        <button
          type="submit"
          className="flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 font-medium text-destructive outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <LogOut aria-hidden="true" className="size-5" />
          Sair
        </button>
      </form>
    </>
  );
}

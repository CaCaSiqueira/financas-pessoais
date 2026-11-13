import { Wallet } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/features/auth/components/user-menu";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-lg font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet aria-hidden="true" className="size-4" />
        </span>
        Finanças
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Suspense fallback={<Skeleton className="size-9 rounded-full" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}

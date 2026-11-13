import { AppHeader } from "@/features/navigation/components/app-header";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";
import { BottomNav } from "@/features/navigation/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-3 focus:ring-ring/50"
      >
        Pular para o conteúdo
      </a>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main
          id="conteudo"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] outline-none md:px-8 md:pb-10"
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

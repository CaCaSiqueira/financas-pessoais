import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Finanças Pessoais</h1>
        <ThemeToggle />
      </header>
      <p className="text-muted-foreground">Seu controle financeiro pessoal. Em construção.</p>
    </main>
  );
}

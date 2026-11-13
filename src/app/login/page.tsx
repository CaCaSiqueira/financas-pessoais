import { Wallet } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { LoginErrorMessage } from "@/features/auth/components/login-error-message";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col px-4 py-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Wallet aria-hidden="true" className="size-7" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Finanças Pessoais</h1>
          <p className="text-muted-foreground">
            Entre com sua conta Google para acessar seu controle financeiro.
          </p>
        </div>
        <Suspense fallback={null}>
          <LoginErrorMessage />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-11 w-full animate-pulse rounded-lg bg-muted" aria-hidden="true" />
          }
        >
          <GoogleSignInButton />
        </Suspense>
      </div>
    </main>
  );
}

"use client";

import { useSearchParams } from "next/navigation";

export function LoginErrorMessage() {
  const error = useSearchParams().get("error");
  if (!error) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm"
    >
      Não foi possível concluir o login. Tente novamente.
    </p>
  );
}

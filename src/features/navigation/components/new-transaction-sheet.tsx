"use client";

import type { ReactElement } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Formulário de novo lançamento (placeholder até a sprint de lançamentos). */
export function NewTransactionSheet({
  trigger,
  side = "bottom",
}: {
  trigger: ReactElement;
  side?: "bottom" | "right";
}) {
  return (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent side={side} className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <SheetHeader>
          <SheetTitle>Novo lançamento</SheetTitle>
          <SheetDescription>
            Em breve você poderá registrar receitas e despesas por aqui.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

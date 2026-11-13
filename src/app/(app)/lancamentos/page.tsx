import { ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Lançamentos" };

export default function LancamentosPage() {
  return (
    <>
      <PageHeader title="Lançamentos" description="Receitas, despesas e transferências." />
      <EmptyState
        icon={ArrowLeftRight}
        title="Nenhum lançamento ainda"
        description="Toque em “+” para registrar sua primeira receita ou despesa."
      />
    </>
  );
}

import { House } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Início" };

export default function InicioPage() {
  return (
    <>
      <PageHeader title="Início" description="Resumo das suas finanças." />
      <EmptyState
        icon={House}
        title="Tudo pronto para começar"
        description="Quando você cadastrar contas e lançamentos, o resumo do mês aparecerá aqui."
      />
    </>
  );
}

import { ChartPie } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Relatórios" };

export default function RelatoriosPage() {
  return (
    <>
      <PageHeader title="Relatórios" description="Gráficos e comparativos do seu dinheiro." />
      <EmptyState
        icon={ChartPie}
        title="Ainda não há dados para relatórios"
        description="Os gráficos aparecem assim que houver lançamentos registrados."
      />
    </>
  );
}

import { Tags } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Categorias" };

export default function CategoriasPage() {
  return (
    <>
      <PageHeader title="Categorias" description="Organize seus lançamentos por categoria." />
      <EmptyState
        icon={Tags}
        title="Nenhuma categoria ainda"
        description="Crie categorias como Mercado, Moradia e Lazer para entender seus gastos."
      />
    </>
  );
}

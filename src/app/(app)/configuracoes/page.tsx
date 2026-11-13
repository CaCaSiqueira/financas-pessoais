import { Settings } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader title="Configurações" description="Preferências da sua conta." />
      <EmptyState
        icon={Settings}
        title="Nada para configurar por enquanto"
        description="Em breve você poderá ajustar moeda, perfil e preferências aqui."
      />
    </>
  );
}

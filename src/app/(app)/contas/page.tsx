import { Wallet } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Contas" };

export default function ContasPage() {
  return (
    <>
      <PageHeader title="Contas" description="Contas bancárias, carteiras e cartões." />
      <EmptyState
        icon={Wallet}
        title="Nenhuma conta cadastrada"
        description="Cadastre suas contas para acompanhar os saldos em um só lugar."
      />
    </>
  );
}

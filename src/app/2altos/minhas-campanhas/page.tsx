"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { CampaignCard } from "@/components/shared/campaign-card";
import { StatsGrid } from "@/components/shared/stats-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/hooks/use-collection";
import { formatCurrency } from "@/lib/utils";
import campaignsData from "@/data/2altos/campaigns.json";
import type { Campaign } from "@/lib/types";
import { Plus } from "lucide-react";

function MinhasCampanhasContent() {
  const { user } = useAuth();

  const { data: campaigns, loading } = useCollection<Campaign>("campaigns", {
    mockData: campaignsData as unknown as Campaign[],
    filters: [
      { field: "projeto", op: "==", value: "2altos" },
      { field: "criadorId", op: "==", value: user?.id ?? "" },
    ],
  });

  if (loading) {
    return <div className="text-center py-20 text-muted">Carregando...</div>;
  }

  const ativas = campaigns.filter((c) => c.status === "ativa" || !c.status).length;
  const totalArrecadado = campaigns.reduce((sum, c) => sum + (c.arrecadado || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Campanhas</h1>
          <p className="text-muted text-sm">Gerencie suas campanhas de financiamento</p>
        </div>
        <Link href="/2altos/campanhas/criar">
          <Button>
            <Plus size={18} /> Nova Campanha
          </Button>
        </Link>
      </div>

      <StatsGrid
        stats={[
          { label: "Total", value: campaigns.length, color: "#f59e0b" },
          { label: "Ativas", value: ativas, color: "#10b981" },
          { label: "Arrecadado", value: formatCurrency(totalArrecadado), color: "#3b82f6" },
        ]}
      />

      {campaigns.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/2altos/campanhas/${c.id}`}>
              <CampaignCard campaign={c} accentColor="#f59e0b" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState message="Voce ainda nao criou nenhuma campanha." />
      )}
    </div>
  );
}

export default function MinhasCampanhasPage() {
  return (
    <ProtectedRoute>
      <MinhasCampanhasContent />
    </ProtectedRoute>
  );
}

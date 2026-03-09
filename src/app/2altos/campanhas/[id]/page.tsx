"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Target, Users, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMock } from "@/lib/firebase";
import { getDocById, daysRemaining } from "@/lib/firestore";
import { formatCurrency, formatPercent } from "@/lib/utils";
import campaignsData from "@/data/2altos/campaigns.json";
import type { Campaign } from "@/lib/types";

const categoryColors: Record<string, string> = {
  Estrategia: "#3b82f6",
  Cooperativo: "#10b981",
  Economia: "#f59e0b",
  Combate: "#ef4444",
  Educativo: "#8b5cf6",
  Construcao: "#06b6d4",
};

export default function CampanhaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (useMock) {
        const mockCampaigns = campaignsData as unknown as Campaign[];
        const found = mockCampaigns.find((c) => c.id === id) ?? null;
        setCampaign(found);
      } else {
        const doc = await getDocById<Campaign>("campaigns", id);
        setCampaign(doc);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="space-y-4">
        <Link
          href="/2altos/campanhas"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Voltar para campanhas
        </Link>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-muted">Campanha nao encontrada.</p>
        </div>
      </div>
    );
  }

  const dias = campaign.diasRestantes ?? daysRemaining(campaign.dataFim);
  const criador = campaign.criadorNome || campaign.criador || "Anonimo";
  const accentColor = categoryColors[campaign.categoria] || "#3b82f6";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back + Edit */}
      <div className="flex items-center justify-between">
        <Link
          href="/2altos/campanhas"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Voltar para campanhas
        </Link>
        <Link href={`/2altos/campanhas/${id}/editar`}>
          <Button variant="ghost" size="sm">
            <Pencil size={14} /> Editar
          </Button>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold">{campaign.titulo}</h1>
            <Badge color={accentColor}>{campaign.categoria}</Badge>
          </div>

          <p className="text-sm text-muted">por {criador}</p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">
                {formatCurrency(campaign.arrecadado)} de{" "}
                {formatCurrency(campaign.meta)}
              </span>
              <span className="font-semibold" style={{ color: accentColor }}>
                {formatPercent(campaign.percentual)}
              </span>
            </div>
            <Progress value={campaign.percentual} color={accentColor} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-background rounded-xl p-3 text-center">
              <Target size={18} className="mx-auto text-muted mb-1" />
              <p className="text-lg font-bold">
                {formatCurrency(campaign.meta)}
              </p>
              <p className="text-xs text-muted">Meta</p>
            </div>
            <div className="bg-background rounded-xl p-3 text-center">
              <div
                className="w-[18px] h-[18px] mx-auto mb-1 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: accentColor, color: "white" }}
              >
                $
              </div>
              <p className="text-lg font-bold">
                {formatCurrency(campaign.arrecadado)}
              </p>
              <p className="text-xs text-muted">Arrecadado</p>
            </div>
            <div className="bg-background rounded-xl p-3 text-center">
              <Calendar size={18} className="mx-auto text-muted mb-1" />
              <p className="text-lg font-bold">{dias}</p>
              <p className="text-xs text-muted">Dias restantes</p>
            </div>
            <div className="bg-background rounded-xl p-3 text-center">
              <Users size={18} className="mx-auto text-muted mb-1" />
              <p className="text-lg font-bold">{campaign.backers ?? 0}</p>
              <p className="text-xs text-muted">Apoiadores</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-border p-6">
          <h2 className="font-semibold mb-3">Sobre a campanha</h2>
          <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
            {campaign.descricao}
          </p>
        </div>

        {/* Faixa etaria */}
        {campaign.faixaEtaria && (
          <div className="border-t border-border px-6 py-4 flex items-center gap-2">
            <span className="text-sm text-muted">Faixa etaria:</span>
            <Badge className="bg-background text-foreground border border-border">
              {campaign.faixaEtaria}
            </Badge>
          </div>
        )}

        {/* Apoiar */}
        <div className="border-t border-border p-6">
          <Button size="lg" className="w-full" disabled>
            Apoiar esta campanha (em breve)
          </Button>
        </div>
      </div>
    </div>
  );
}

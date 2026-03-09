import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Campaign } from "@/lib/types";
import { daysRemaining } from "@/lib/firestore";
import { Clock, Users } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  accentColor?: string;
}

export function CampaignCard({ campaign, accentColor }: CampaignCardProps) {
  const dias = campaign.diasRestantes ?? daysRemaining(campaign.dataFim);
  const criador = campaign.criadorNome || campaign.criador || "Anônimo";
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all hover:-translate-y-0.5">
      {campaign.imagem && (
        <div className="h-40 bg-card-hover overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${campaign.imagem})` }}
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{campaign.titulo}</h3>
          <Badge color={accentColor}>{campaign.categoria}</Badge>
        </div>
        <p className="text-xs text-muted line-clamp-2">{campaign.descricao}</p>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted">{formatCurrency(campaign.arrecadado)} de {formatCurrency(campaign.meta)}</span>
            <span className="font-semibold" style={{ color: accentColor }}>{formatPercent(campaign.percentual)}</span>
          </div>
          <Progress value={campaign.percentual} color={accentColor} />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1"><Clock size={12} /> {dias} dias</span>
          <span className="flex items-center gap-1"><Users size={12} /> {criador}</span>
        </div>
      </div>
    </div>
  );
}

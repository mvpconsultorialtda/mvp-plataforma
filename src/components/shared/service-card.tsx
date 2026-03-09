import { Badge } from "@/components/ui/badge";
import type { ServiceProvider } from "@/lib/types";
import { Star, MapPin } from "lucide-react";

interface ServiceCardProps {
  provider: ServiceProvider;
  accentColor?: string;
}

export function ServiceCard({ provider, accentColor }: ServiceCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary transition-all hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-card-hover flex items-center justify-center text-xl shrink-0">
          👤
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm">{provider.nome}</h3>
            <Badge color={accentColor}>{provider.categoria}</Badge>
          </div>
          <p className="text-xs text-muted line-clamp-2">{provider.descricao}</p>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              {provider.avaliacao} ({provider.numAvaliacoes})
            </span>
            {provider.localizacao && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {provider.localizacao}
              </span>
            )}
          </div>
          <div className="flex gap-1 flex-wrap">
            {provider.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-background rounded text-[10px] text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

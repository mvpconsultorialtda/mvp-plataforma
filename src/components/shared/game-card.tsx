import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Game } from "@/lib/types";
import { Star } from "lucide-react";

interface GameCardProps {
  game: Game;
  accentColor?: string;
}

export function GameCard({ game, accentColor }: GameCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all hover:-translate-y-0.5">
      <div className="h-36 bg-card-hover flex items-center justify-center text-4xl">
        🎲
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{game.titulo}</h3>
          <Badge color={accentColor}>{game.categoria}</Badge>
        </div>
        <p className="text-xs text-muted line-clamp-2">{game.descricao}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{game.avaliacao}</span>
            <span className="text-xs text-muted">({game.numAvaliacoes})</span>
          </div>
          {game.preco !== undefined && (
            <span className="font-bold text-sm" style={{ color: accentColor }}>
              {formatCurrency(game.preco)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted">{game.criador}</p>
      </div>
    </div>
  );
}

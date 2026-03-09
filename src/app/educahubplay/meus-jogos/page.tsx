"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { GameCard } from "@/components/shared/game-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/hooks/use-collection";
import gamesData from "@/data/educahubplay/games.json";
import type { Game } from "@/lib/types";
import { Plus } from "lucide-react";

function MeusJogosContent() {
  const { user } = useAuth();

  const { data: games, loading } = useCollection<Game>("games", {
    mockData: gamesData as unknown as Game[],
    filters: [
      { field: "projeto", op: "==", value: "educahubplay" },
      { field: "criadorId", op: "==", value: user?.id ?? "" },
    ],
  });

  if (loading) {
    return <div className="text-center py-20 text-muted">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Jogos Educacionais</h1>
          <p className="text-muted text-sm">Jogos educacionais que voce criou</p>
        </div>
        <Link href="/educahubplay/meus-jogos/criar">
          <Button>
            <Plus size={18} /> Criar Jogo
          </Button>
        </Link>
      </div>

      {games.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => (
            <GameCard key={g.id} game={g} accentColor="#8b5cf6" />
          ))}
        </div>
      ) : (
        <EmptyState message="Voce ainda nao criou nenhum jogo educacional." />
      )}
    </div>
  );
}

export default function MeusJogosEducahubPage() {
  return (
    <ProtectedRoute>
      <MeusJogosContent />
    </ProtectedRoute>
  );
}

"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { GameCard } from "@/components/shared/game-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/hooks/use-collection";
import gamesData from "@/data/2altos/games.json";
import type { Game } from "@/lib/types";
import { Plus } from "lucide-react";

function MeusJogosContent() {
  const { user } = useAuth();

  const { data: games, loading } = useCollection<Game>("games", {
    mockData: gamesData as unknown as Game[],
    filters: [
      { field: "projeto", op: "==", value: "2altos" },
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
          <h1 className="text-2xl font-bold">Meus Jogos</h1>
          <p className="text-muted text-sm">Jogos de tabuleiro que voce cadastrou</p>
        </div>
        <Link href="/2altos/loja/cadastrar">
          <Button>
            <Plus size={18} /> Cadastrar Jogo
          </Button>
        </Link>
      </div>

      {games.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => (
            <Link key={g.id} href={`/2altos/loja/${g.id}`}>
              <GameCard game={g} accentColor="#3b82f6" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState message="Voce ainda nao cadastrou nenhum jogo." />
      )}
    </div>
  );
}

export default function MeusJogosPage() {
  return (
    <ProtectedRoute>
      <MeusJogosContent />
    </ProtectedRoute>
  );
}

"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { GameCard } from "@/components/shared/game-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useCollection } from "@/hooks/use-collection";
import gamesData from "@/data/2altos/games.json";
import type { Game } from "@/lib/types";

export default function LojaAltPage() {
  const { data: games, loading } = useCollection<Game>("games", {
    mockData: gamesData as unknown as Game[],
    filters: [{ field: "projeto", op: "==", value: "2altos" }],
  });
  const [search, setSearch] = useState("");

  if (loading) return <div className="text-center py-20 text-muted">Carregando...</div>;

  const filtered = games.filter((g) => g.titulo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Loja</h1>
        <p className="text-muted text-sm">Jogos com detalhes completos</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar jogos..." />
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => <GameCard key={g.id} game={g} accentColor="#b45309" />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { GameCard } from "@/components/shared/game-card";
import { EmptyState } from "@/components/shared/empty-state";
import gamesData from "@/data/2altos/games.json";
import type { Game, Category } from "@/lib/types";

const games: Game[] = gamesData;
const categories: Category[] = [
  { id: "Estrategia", label: "Estrategia", color: "#3b82f6" },
  { id: "Economia", label: "Economia", color: "#f59e0b" },
  { id: "Party", label: "Party", color: "#ec4899" },
  { id: "Cooperativo", label: "Cooperativo", color: "#10b981" },
  { id: "Abstrato", label: "Abstrato", color: "#8b5cf6" },
];

export default function LojaPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = games.filter((g) => {
    const matchSearch = g.titulo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || g.categoria === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Loja</h1>
        <p className="text-muted text-sm">Os melhores jogos de tabuleiro</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar jogos..." />
      <FilterBar categories={categories} active={filter} onSelect={setFilter} />
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => <GameCard key={g.id} game={g} accentColor="#f59e0b" />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

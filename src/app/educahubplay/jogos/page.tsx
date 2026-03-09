"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { GameCard } from "@/components/shared/game-card";
import { EmptyState } from "@/components/shared/empty-state";
import gamesData from "@/data/educahubplay/games.json";
import type { Game, Category } from "@/lib/types";

const games = gamesData as unknown as Game[];
const categories: Category[] = [
  { id: "Ciencias", label: "Ciencias", color: "#10b981" },
  { id: "Portugues", label: "Portugues", color: "#3b82f6" },
  { id: "Historia", label: "Historia", color: "#f59e0b" },
  { id: "Matematica", label: "Matematica", color: "#ef4444" },
  { id: "Geografia", label: "Geografia", color: "#06b6d4" },
];

export default function JogosPage() {
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
        <h1 className="text-2xl font-bold">Jogos Educacionais</h1>
        <p className="text-muted text-sm">Catalogo de jogos por disciplina</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar jogos..." />
      <FilterBar categories={categories} active={filter} onSelect={setFilter} />
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => <GameCard key={g.id} game={g} accentColor="#8b5cf6" />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

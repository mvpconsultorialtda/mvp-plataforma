"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { CampaignCard } from "@/components/shared/campaign-card";
import { StatsGrid } from "@/components/shared/stats-grid";
import { EmptyState } from "@/components/shared/empty-state";
import campaignsData from "@/data/xequemath/campaigns.json";
import type { Campaign, Category } from "@/lib/types";

const campaigns: Campaign[] = campaignsData;
const categories: Category[] = [
  { id: "Aritmetica", label: "Aritmetica", color: "#ef4444" },
  { id: "Algebra", label: "Algebra", color: "#3b82f6" },
  { id: "Geometria", label: "Geometria", color: "#10b981" },
  { id: "Financeira", label: "Financeira", color: "#f59e0b" },
  { id: "Estatistica", label: "Estatistica", color: "#8b5cf6" },
  { id: "Logica", label: "Logica", color: "#06b6d4" },
];

export default function CampanhasPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) || c.descricao.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || c.categoria === filter;
    return matchSearch && matchFilter;
  });

  const totalArrecadado = campaigns.reduce((s, c) => s + c.arrecadado, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Campanhas XequeMath</h1>
        <p className="text-muted text-sm">Financie jogos educacionais de matematica</p>
      </div>
      <StatsGrid stats={[
        { label: "Campanhas", value: campaigns.length, color: "#10b981" },
        { label: "Total Arrecadado", value: `R$ ${(totalArrecadado / 1000).toFixed(0)}k`, color: "#f59e0b" },
        { label: "Media %", value: `${Math.round(campaigns.reduce((s, c) => s + c.percentual, 0) / campaigns.length)}%`, color: "#3b82f6" },
        { label: "Categorias", value: categories.length, color: "#8b5cf6" },
      ]} />
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar campanhas..." />
      <FilterBar categories={categories} active={filter} onSelect={setFilter} />
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => <CampaignCard key={c.id} campaign={c} accentColor="#10b981" />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

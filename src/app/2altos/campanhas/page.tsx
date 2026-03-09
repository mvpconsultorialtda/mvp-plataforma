"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { CampaignCard } from "@/components/shared/campaign-card";
import { StatsGrid } from "@/components/shared/stats-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { useCollection } from "@/hooks/use-collection";
import campaignsData from "@/data/2altos/campaigns.json";
import type { Campaign, Category } from "@/lib/types";
const categories: Category[] = [
  { id: "Estrategia", label: "Estrategia", color: "#3b82f6" },
  { id: "Cooperativo", label: "Cooperativo", color: "#10b981" },
  { id: "Economia", label: "Economia", color: "#f59e0b" },
  { id: "Combate", label: "Combate", color: "#ef4444" },
  { id: "Educativo", label: "Educativo", color: "#8b5cf6" },
  { id: "Construcao", label: "Construcao", color: "#06b6d4" },
];

export default function CampanhasPage() {
  const { data: campaigns, loading } = useCollection<Campaign>("campaigns", {
    mockData: campaignsData as unknown as Campaign[],
    filters: [{ field: "projeto", op: "==", value: "2altos" }],
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  if (loading) return <div className="text-center py-20 text-muted">Carregando...</div>;

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) || c.descricao.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || c.categoria === filter;
    return matchSearch && matchFilter;
  });

  const totalArrecadado = campaigns.reduce((s, c) => s + c.arrecadado, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Campanhas</h1>
        <p className="text-muted text-sm">Financie os proximos grandes jogos de tabuleiro</p>
      </div>
      <StatsGrid stats={[
        { label: "Campanhas", value: campaigns.length, color: "#f59e0b" },
        { label: "Total Arrecadado", value: `R$ ${(totalArrecadado / 1000).toFixed(0)}k`, color: "#10b981" },
        { label: "Media %", value: `${Math.round(campaigns.reduce((s, c) => s + c.percentual, 0) / campaigns.length)}%`, color: "#3b82f6" },
        { label: "Categorias", value: categories.length, color: "#8b5cf6" },
      ]} />
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar campanhas..." />
      <FilterBar categories={categories} active={filter} onSelect={setFilter} />
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => <CampaignCard key={c.id} campaign={c} accentColor="#f59e0b" />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

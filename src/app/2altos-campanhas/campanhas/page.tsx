"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { CampaignCard } from "@/components/shared/campaign-card";
import { EmptyState } from "@/components/shared/empty-state";
import campaignsData from "@/data/2altos/campaigns.json";
import type { Campaign, Category } from "@/lib/types";

const campaigns: Campaign[] = campaignsData;
const categories: Category[] = [
  { id: "Estrategia", label: "Estrategia", color: "#92400e" },
  { id: "Cooperativo", label: "Cooperativo", color: "#065f46" },
  { id: "Economia", label: "Economia", color: "#78350f" },
  { id: "Combate", label: "Combate", color: "#991b1b" },
];

export default function CampanhasAltPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || c.categoria === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Campanhas</h1>
        <p className="text-muted text-sm">Design alternativo com tema rustico</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar campanhas..." />
      <FilterBar categories={categories} active={filter} onSelect={setFilter} />
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => <CampaignCard key={c.id} campaign={c} accentColor="#b45309" />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

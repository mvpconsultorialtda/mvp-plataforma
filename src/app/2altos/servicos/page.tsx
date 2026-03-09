"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { ServiceCard } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import servicesData from "@/data/2altos/services.json";
import type { ServiceProvider } from "@/lib/types";

const providers: ServiceProvider[] = servicesData;

export default function ServicosPage() {
  const [search, setSearch] = useState("");

  const filtered = providers.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Servicos</h1>
        <p className="text-muted text-sm">Encontre profissionais para seu jogo de tabuleiro</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar servicos..." />
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((p) => <ServiceCard key={p.id} provider={p} accentColor="#f59e0b" />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

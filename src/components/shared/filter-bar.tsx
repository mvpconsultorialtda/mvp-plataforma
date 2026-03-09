"use client";

import { Filter } from "lucide-react";
import type { Category } from "@/lib/types";

interface FilterBarProps {
  categories: Category[];
  active: string | null;
  onSelect: (id: string | null) => void;
}

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter size={16} className="text-muted" />
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          !active
            ? "bg-primary border-primary text-white"
            : "border-border text-muted hover:text-foreground hover:border-primary"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(active === cat.id ? null : cat.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            active === cat.id
              ? "text-white border-transparent"
              : "border-border text-muted hover:text-foreground"
          }`}
          style={active === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useCollection } from "@/hooks/use-collection";
import { createDoc, deleteDocument } from "@/lib/firestore";
import { useMock } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import type { Category, CategoryType, ProjectSlug } from "@/lib/types";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", label: "Estratégia", color: "#3b82f6", projeto: "2altos", tipo: "campaign" },
  { id: "cat-2", label: "Cooperativo", color: "#8b5cf6", projeto: "2altos", tipo: "campaign" },
  { id: "cat-3", label: "Economia", color: "#f59e0b", projeto: "2altos", tipo: "game" },
  { id: "cat-4", label: "Educativo", color: "#10b981", projeto: "2altos", tipo: "game" },
  { id: "cat-5", label: "Design Gráfico", color: "#ec4899", projeto: "2altos", tipo: "service" },
  { id: "cat-6", label: "Matemática", color: "#ef4444", projeto: "xequemath", tipo: "campaign" },
  { id: "cat-7", label: "Ciências", color: "#06b6d4", projeto: "educahubplay", tipo: "game" },
  { id: "cat-8", label: "Português", color: "#84cc16", projeto: "educahubplay", tipo: "game" },
];

const PROJETOS: { value: ProjectSlug; label: string }[] = [
  { value: "2altos", label: "2Altos" },
  { value: "2altos-campanhas", label: "2Altos Campanhas" },
  { value: "educahubplay", label: "EducaHubPlay" },
  { value: "xequemath", label: "XequeMath" },
];

const TIPOS: { value: CategoryType; label: string }[] = [
  { value: "campaign", label: "Campanha" },
  { value: "game", label: "Jogo" },
  { value: "service", label: "Serviço" },
  { value: "exchange", label: "Troca" },
];

export default function AdminCategoriasPage() {
  const { data: firestoreCategories, loading, refetch } = useCollection<Category>("categories", {
    mockData: MOCK_CATEGORIES,
  });

  const [localCategories, setLocalCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [projeto, setProjeto] = useState<ProjectSlug>("2altos");
  const [tipo, setTipo] = useState<CategoryType>("campaign");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const categories = useMock ? localCategories : firestoreCategories;

  // Group categories by projeto then tipo
  const grouped = categories.reduce<Record<string, Record<string, Category[]>>>((acc, cat) => {
    const p = cat.projeto || "geral";
    const t = cat.tipo || "campaign";
    if (!acc[p]) acc[p] = {};
    if (!acc[p][t]) acc[p][t] = [];
    acc[p][t].push(cat);
    return acc;
  }, {});

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;

    setSaving(true);
    try {
      if (useMock) {
        const newCat: Category = {
          id: `cat-${Date.now()}`,
          label: label.trim(),
          color,
          projeto,
          tipo,
        };
        setLocalCategories((prev) => [...prev, newCat]);
      } else {
        await createDoc("categories", { label: label.trim(), color, projeto, tipo });
        refetch();
      }
      setLabel("");
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      if (useMock) {
        setLocalCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        await deleteDocument("categories", id);
        refetch();
      }
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
    } finally {
      setDeleting(null);
    }
  }

  const projetoLabel = (slug: string) =>
    PROJETOS.find((p) => p.value === slug)?.label || slug;

  const tipoLabel = (t: string) =>
    TIPOS.find((tp) => tp.value === t)?.label || t;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Categorias</h1>
        </div>

        {/* Add Form */}
        <form
          onSubmit={handleAdd}
          className="bg-card border border-border rounded-lg p-4 mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">Nova Categoria</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs text-muted mb-1">Nome</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Estratégia"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Cor</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent"
                />
                <span className="text-xs text-muted">{color}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Projeto</label>
              <select
                value={projeto}
                onChange={(e) => setProjeto(e.target.value as ProjectSlug)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PROJETOS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as CategoryType)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm" disabled={saving || !label.trim()}>
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </form>

        {/* Categories List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted">Nenhuma categoria cadastrada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([proj, tipos]) => (
                <div key={proj} className="bg-card border border-border rounded-lg p-4">
                  <h2 className="text-base font-semibold text-foreground mb-3">
                    {projetoLabel(proj)}
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(tipos)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([t, cats]) => (
                        <div key={t}>
                          <h3 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                            {tipoLabel(t)}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {cats.map((cat) => (
                              <div
                                key={cat.id}
                                className="flex items-center gap-2 bg-background border border-border rounded-full pl-2 pr-1 py-1 text-sm"
                              >
                                <span
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: cat.color }}
                                />
                                <span className="text-foreground">{cat.label}</span>
                                <button
                                  onClick={() => handleDelete(cat.id)}
                                  disabled={deleting === cat.id}
                                  className="p-1 rounded-full text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                                  title="Excluir categoria"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

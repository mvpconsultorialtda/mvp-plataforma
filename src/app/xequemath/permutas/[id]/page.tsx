"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMock } from "@/lib/firebase";
import { getDocById } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import type { Exchange } from "@/lib/types";

const tipoColors: Record<string, string> = {
  venda: "#10b981",
  troca: "#f59e0b",
  doacao: "#3b82f6",
};

const tipoLabels: Record<string, string> = {
  venda: "Venda",
  troca: "Troca",
  doacao: "Doacao",
};

const condicaoLabels: Record<string, string> = {
  novo: "Novo",
  seminovo: "Seminovo",
  usado: "Usado",
};

export default function PermutaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (useMock) {
        // No mock data for xequemath exchanges yet - show placeholder
        setExchange({
          id,
          titulo: "Exemplo de Anuncio",
          descricao: "Este e um anuncio de exemplo. Dados reais serao carregados quando o Firebase estiver configurado.",
          vendedorId: "mock-1",
          vendedorNome: "Maria Silva",
          tipo: "venda",
          condicao: "seminovo",
          preco: 49.90,
          localizacao: "Sao Paulo, SP",
          projeto: "xequemath",
          status: "ativo",
          createdAt: new Date().toISOString(),
        });
      } else {
        const doc = await getDocById<Exchange>("exchanges", id);
        setExchange(doc);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted">Anuncio nao encontrado.</p>
        <Link href="/xequemath/permutas" className="text-emerald-400 hover:underline text-sm">
          Voltar para Permutas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/xequemath/permutas"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Permutas
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{exchange.titulo}</h1>
            <Badge color={tipoColors[exchange.tipo] ?? "#10b981"}>
              {tipoLabels[exchange.tipo] ?? exchange.tipo}
            </Badge>
          </div>
          <p className="text-sm text-muted">por {exchange.vendedorNome}</p>
        </div>

        <p className="text-sm leading-relaxed text-foreground/80">{exchange.descricao}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <p className="text-xs text-muted mb-1">Condicao</p>
            <p className="font-medium">{condicaoLabels[exchange.condicao] ?? exchange.condicao}</p>
          </div>

          {exchange.preco != null && exchange.tipo === "venda" && (
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Preco</p>
              <p className="text-lg font-bold text-emerald-400">R$ {exchange.preco.toFixed(2)}</p>
            </div>
          )}
        </div>

        {exchange.localizacao && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <MapPin size={16} />
            <span>{exchange.localizacao}</span>
          </div>
        )}
      </div>
    </div>
  );
}

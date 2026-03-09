"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMock } from "@/lib/firebase";
import { getDocById } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import gamesData from "@/data/2altos/games.json";
import type { Game } from "@/lib/types";

const games = gamesData as unknown as Game[];

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (useMock) {
        const found = games.find((g) => g.id === id) ?? null;
        setGame(found);
      } else {
        const doc = await getDocById<Game>("games", id);
        setGame(doc);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted">Jogo não encontrado.</p>
        <Link href="/2altos/loja" className="text-primary hover:underline text-sm">
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/2altos/loja"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Loja
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{game.titulo}</h1>
            <Badge color="#3b82f6">{game.categoria}</Badge>
          </div>

          {game.criador || game.criadorNome ? (
            <p className="text-sm text-muted">por {game.criador ?? game.criadorNome}</p>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-foreground/80">{game.descricao}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {game.preco != null && (
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Preço</p>
              <p className="text-lg font-bold text-primary">R$ {game.preco.toFixed(2)}</p>
            </div>
          )}

          <div className="bg-background border border-border rounded-lg p-4">
            <p className="text-xs text-muted mb-1">Avaliação</p>
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{game.avaliacao}</span>
              <span className="text-xs text-muted">({game.numAvaliacoes} avaliações)</span>
            </div>
          </div>

          {game.faixaEtaria && (
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Faixa Etária</p>
              <p className="font-medium">{game.faixaEtaria}</p>
            </div>
          )}

          {game.jogadores && (
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Jogadores</p>
              <p className="font-medium">{game.jogadores}</p>
            </div>
          )}

          {game.tempo && (
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Tempo de Jogo</p>
              <p className="font-medium">{game.tempo}</p>
            </div>
          )}

          {game.complexidade && (
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Complexidade</p>
              <p className="font-medium capitalize">{game.complexidade}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

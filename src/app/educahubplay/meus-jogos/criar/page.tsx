"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gameSchema, type GameInput } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { useMock } from "@/lib/firebase";
import { createDoc } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const categorias = ["Ciencias", "Portugues", "Historia", "Matematica", "Geografia"];
const complexidades = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

const inputClass =
  "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary";

function CriarJogoContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameInput>({
    resolver: zodResolver(gameSchema),
  });

  const onSubmit = async (data: GameInput) => {
    setSaving(true);
    try {
      if (useMock) {
        alert("Jogo educacional cadastrado com sucesso! (mock)");
        router.push("/educahubplay/meus-jogos");
        return;
      }

      await createDoc("games", {
        ...data,
        criadorId: user?.id ?? "",
        criadorNome: user?.name ?? "",
        projeto: "educahubplay",
        tipo: "educacional",
        avaliacao: 0,
        numAvaliacoes: 0,
        tags: [],
        status: "publicado",
      });
      router.push("/educahubplay/meus-jogos");
    } catch (err) {
      console.error("Erro ao cadastrar jogo:", err);
      alert("Erro ao cadastrar jogo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/educahubplay/meus-jogos"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Meus Jogos
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Criar Jogo Educacional</h1>
          <p className="text-sm text-muted">Adicione um novo jogo educacional ao catalogo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Titulo *</label>
            <input type="text" {...register("titulo")} className={inputClass} placeholder="Nome do jogo" />
            {errors.titulo && <p className="text-red-400 text-xs mt-1">{errors.titulo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descricao *</label>
            <textarea
              {...register("descricao")}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Descreva o jogo educacional..."
            />
            {errors.descricao && <p className="text-red-400 text-xs mt-1">{errors.descricao.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Disciplina *</label>
              <select {...register("categoria")} className={inputClass}>
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.categoria && <p className="text-red-400 text-xs mt-1">{errors.categoria.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Complexidade</label>
              <select {...register("complexidade")} className={inputClass}>
                <option value="">Selecione...</option>
                {complexidades.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.complexidade && <p className="text-red-400 text-xs mt-1">{errors.complexidade.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Serie / Ano Escolar</label>
              <input type="text" {...register("serie")} className={inputClass} placeholder="Ex: 5o ano" />
              {errors.serie && <p className="text-red-400 text-xs mt-1">{errors.serie.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Faixa Etaria</label>
              <input type="text" {...register("faixaEtaria")} className={inputClass} placeholder="Ex: 8-12 anos" />
              {errors.faixaEtaria && <p className="text-red-400 text-xs mt-1">{errors.faixaEtaria.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Jogadores</label>
              <input type="text" {...register("jogadores")} className={inputClass} placeholder="Ex: 2-6" />
              {errors.jogadores && <p className="text-red-400 text-xs mt-1">{errors.jogadores.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Tempo de Jogo</label>
              <input type="text" {...register("tempo")} className={inputClass} placeholder="Ex: 20-40 min" />
              {errors.tempo && <p className="text-red-400 text-xs mt-1">{errors.tempo.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Preco (R$)</label>
            <input
              type="number"
              step="0.01"
              {...register("preco", { valueAsNumber: true })}
              className={inputClass}
              placeholder="0.00"
            />
            {errors.preco && <p className="text-red-400 text-xs mt-1">{errors.preco.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            <Save size={18} /> {saving ? "Salvando..." : "Criar Jogo Educacional"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function CriarJogoEducahubPage() {
  return (
    <ProtectedRoute>
      <CriarJogoContent />
    </ProtectedRoute>
  );
}

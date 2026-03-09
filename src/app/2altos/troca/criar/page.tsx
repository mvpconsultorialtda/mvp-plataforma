"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exchangeSchema, type ExchangeInput } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { useMock } from "@/lib/firebase";
import { createDoc } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const tipos = [
  { value: "venda", label: "Venda" },
  { value: "troca", label: "Troca" },
  { value: "doacao", label: "Doação" },
];

const condicoes = [
  { value: "novo", label: "Novo" },
  { value: "seminovo", label: "Seminovo" },
  { value: "usado", label: "Usado" },
];

const inputClass =
  "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary";

function CriarTrocaContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExchangeInput>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      tipo: "venda",
      condicao: "seminovo",
    },
  });

  const tipoValue = watch("tipo");

  const onSubmit = async (data: ExchangeInput) => {
    setSaving(true);
    try {
      if (useMock) {
        alert("Anúncio criado com sucesso! (mock)");
        router.push("/2altos/troca");
        return;
      }

      await createDoc("exchanges", {
        ...data,
        vendedorId: user?.id ?? "",
        vendedorNome: user?.name ?? "",
        projeto: "2altos",
        status: "ativo",
      });
      router.push("/2altos/troca");
    } catch (err) {
      console.error("Erro ao criar anúncio:", err);
      alert("Erro ao criar anúncio. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/2altos/troca"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Trocas
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Criar Anúncio</h1>
          <p className="text-sm text-muted">Venda, troque ou doe seus jogos</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Título *</label>
            <input type="text" {...register("titulo")} className={inputClass} placeholder="Nome do item" />
            {errors.titulo && <p className="text-red-400 text-xs mt-1">{errors.titulo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descrição *</label>
            <textarea
              {...register("descricao")}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Descreva o item..."
            />
            {errors.descricao && <p className="text-red-400 text-xs mt-1">{errors.descricao.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Tipo *</label>
              <select {...register("tipo")} className={inputClass}>
                {tipos.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.tipo && <p className="text-red-400 text-xs mt-1">{errors.tipo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Condição *</label>
              <select {...register("condicao")} className={inputClass}>
                {condicoes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.condicao && <p className="text-red-400 text-xs mt-1">{errors.condicao.message}</p>}
            </div>
          </div>

          {tipoValue === "venda" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                {...register("preco", { valueAsNumber: true })}
                className={inputClass}
                placeholder="0.00"
              />
              {errors.preco && <p className="text-red-400 text-xs mt-1">{errors.preco.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Localização</label>
            <input
              type="text"
              {...register("localizacao")}
              className={inputClass}
              placeholder="Ex: São Paulo, SP"
            />
            {errors.localizacao && <p className="text-red-400 text-xs mt-1">{errors.localizacao.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            <Save size={18} /> {saving ? "Salvando..." : "Criar Anúncio"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function CriarTrocaPage() {
  return (
    <ProtectedRoute>
      <CriarTrocaContent />
    </ProtectedRoute>
  );
}

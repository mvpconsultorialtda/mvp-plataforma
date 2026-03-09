"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignSchema, type CampaignInput } from "@/lib/schemas";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { Button } from "@/components/ui/button";
import { useMock } from "@/lib/firebase";
import { getDocById, updateDoc } from "@/lib/firestore";
import campaignsData from "@/data/2altos/campaigns.json";
import type { Campaign } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const categorias = [
  "Estrategia",
  "Cooperativo",
  "Economia",
  "Combate",
  "Educativo",
  "Construcao",
];

function EditarCampanhaForm() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
  });

  useEffect(() => {
    async function load() {
      let campaign: Campaign | null = null;

      if (useMock) {
        const mockCampaigns = campaignsData as unknown as Campaign[];
        campaign = mockCampaigns.find((c) => c.id === id) ?? null;
      } else {
        campaign = await getDocById<Campaign>("campaigns", id);
      }

      if (campaign) {
        reset({
          titulo: campaign.titulo,
          descricao: campaign.descricao,
          meta: campaign.meta,
          categoria: campaign.categoria,
          faixaEtaria: campaign.faixaEtaria || "",
          dataFim:
            typeof campaign.dataFim === "string"
              ? campaign.dataFim.split("T")[0]
              : "",
        });
      }
      setLoading(false);
    }
    load();
  }, [id, reset]);

  const onSubmit = async (data: CampaignInput) => {
    if (useMock) {
      console.log("Mock: campanha atualizada", { id, ...data });
      alert("Campanha atualizada!");
      router.push(`/2altos/campanhas/${id}`);
      return;
    }

    try {
      await updateDoc("campaigns", id, { ...data });
      router.push(`/2altos/campanhas/${id}`);
    } catch (err) {
      console.error("Erro ao atualizar campanha:", err);
      alert("Erro ao atualizar campanha. Tente novamente.");
    }
  };

  const inputClass =
    "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/2altos/campanhas/${id}`}
          className="text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Editar Campanha</h1>
          <p className="text-muted text-sm">Atualize os dados da campanha</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          {/* Titulo */}
          <div>
            <label htmlFor="titulo" className={labelClass}>
              Titulo
            </label>
            <input
              id="titulo"
              type="text"
              placeholder="Nome da campanha"
              className={inputClass}
              {...register("titulo")}
            />
            {errors.titulo && (
              <p className={errorClass}>{errors.titulo.message}</p>
            )}
          </div>

          {/* Descricao */}
          <div>
            <label htmlFor="descricao" className={labelClass}>
              Descricao
            </label>
            <textarea
              id="descricao"
              rows={4}
              placeholder="Descreva sua campanha em detalhes..."
              className={inputClass}
              style={{ resize: "vertical" }}
              {...register("descricao")}
            />
            {errors.descricao && (
              <p className={errorClass}>{errors.descricao.message}</p>
            )}
          </div>

          {/* Meta */}
          <div>
            <label htmlFor="meta" className={labelClass}>
              Meta (R$)
            </label>
            <input
              id="meta"
              type="number"
              min={100}
              placeholder="50000"
              className={inputClass}
              {...register("meta", { valueAsNumber: true })}
            />
            {errors.meta && (
              <p className={errorClass}>{errors.meta.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="categoria" className={labelClass}>
              Categoria
            </label>
            <select
              id="categoria"
              className={inputClass}
              {...register("categoria")}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className={errorClass}>{errors.categoria.message}</p>
            )}
          </div>

          {/* Faixa Etaria */}
          <div>
            <label htmlFor="faixaEtaria" className={labelClass}>
              Faixa Etaria{" "}
              <span className="text-muted font-normal">(opcional)</span>
            </label>
            <input
              id="faixaEtaria"
              type="text"
              placeholder="Ex: 10+"
              className={inputClass}
              {...register("faixaEtaria")}
            />
            {errors.faixaEtaria && (
              <p className={errorClass}>{errors.faixaEtaria.message}</p>
            )}
          </div>

          {/* Data Fim */}
          <div>
            <label htmlFor="dataFim" className={labelClass}>
              Data Final
            </label>
            <input
              id="dataFim"
              type="date"
              className={inputClass}
              {...register("dataFim")}
            />
            {errors.dataFim && (
              <p className={errorClass}>{errors.dataFim.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alteracoes"}
            </Button>
            <Link href={`/2altos/campanhas/${id}`}>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function EditarCampanhaPage() {
  return (
    <ProtectedRoute>
      <EditarCampanhaForm />
    </ProtectedRoute>
  );
}

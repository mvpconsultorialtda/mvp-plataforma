"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributionSchema, type ContributionInput } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { useMock } from "@/lib/firebase";
import { createDoc } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";

interface ContributeModalProps {
  campaignId: string;
  campaignTitulo: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ContributeModal({ campaignId, campaignTitulo, isOpen, onClose }: ContributeModalProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionInput>({
    resolver: zodResolver(contributionSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ContributionInput) => {
    setSaving(true);
    try {
      if (useMock) {
        alert(`Apoio de R$ ${data.valor.toFixed(2)} registrado!`);
        reset();
        onClose();
        return;
      }

      await createDoc("contributions", {
        campaignId,
        userId: user?.id ?? "",
        valor: data.valor,
        status: "pendente",
      });
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao registrar contribuicao:", err);
      alert("Erro ao registrar contribuicao. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Apoiar Campanha</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-muted">
          Voce esta apoiando: <span className="text-foreground font-medium">{campaignTitulo}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Valor do apoio (R$)</label>
            <input
              type="number"
              step="0.01"
              min="5"
              {...register("valor", { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="Minimo R$ 5,00"
            />
            {errors.valor && <p className="text-red-400 text-xs mt-1">{errors.valor.message}</p>}
          </div>

          <div className="flex gap-2">
            {[10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[name="valor"]');
                  if (input) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value"
                    )?.set;
                    nativeInputValueSetter?.call(input, String(val));
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }}
                className="flex-1 px-2 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-card-hover transition-colors"
              >
                R$ {val}
              </button>
            ))}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            <Heart size={18} /> {saving ? "Processando..." : "Confirmar Apoio"}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { useMock } from "@/lib/firebase";
import { createDoc } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Star, Send } from "lucide-react";

interface ReviewFormProps {
  targetId: string;
  targetType: "game" | "service";
  onSubmitted?: () => void;
}

export function ReviewForm({ targetId, targetType, onSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { nota: 0, comentario: "" },
  });

  const nota = watch("nota");

  const onSubmit = async (data: ReviewInput) => {
    setSaving(true);
    try {
      if (useMock) {
        console.log("Review (mock):", { targetId, targetType, ...data });
        reset();
        onSubmitted?.();
        return;
      }

      await createDoc("reviews", {
        targetId,
        targetType,
        userId: user?.id ?? "",
        userName: user?.name ?? "",
        nota: data.nota,
        comentario: data.comentario || "",
      });
      reset();
      onSubmitted?.();
    } catch (err) {
      console.error("Erro ao enviar avaliacao:", err);
      alert("Erro ao enviar avaliacao. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-4 space-y-3">
      <h4 className="text-sm font-semibold">Deixe sua avaliacao</h4>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setValue("nota", star, { shouldValidate: true })}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={
                star <= (hoveredStar || nota)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted"
              }
            />
          </button>
        ))}
        {errors.nota && <span className="text-red-400 text-xs ml-2">{errors.nota.message}</span>}
      </div>

      <input type="hidden" {...register("nota", { valueAsNumber: true })} />

      <textarea
        {...register("comentario")}
        rows={2}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
        placeholder="Comentario (opcional)..."
      />
      {errors.comentario && <p className="text-red-400 text-xs">{errors.comentario.message}</p>}

      <Button type="submit" size="sm" disabled={saving}>
        <Send size={14} /> {saving ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}

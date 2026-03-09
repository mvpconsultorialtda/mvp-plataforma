"use client";

import { EmptyState } from "@/components/shared/empty-state";
import type { Review } from "@/lib/types";
import { Star } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

function formatDate(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") {
    return new Date(value).toLocaleDateString("pt-BR");
  }
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString("pt-BR");
  }
  return "";
}

function Stars({ nota }: { nota: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= nota
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted"
          }
        />
      ))}
    </div>
  );
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <EmptyState message="Nenhuma avaliacao ainda." />;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-card border border-border rounded-xl p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{review.userName || "Anonimo"}</span>
              <Stars nota={review.nota} />
            </div>
            <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
          </div>
          {review.comentario && (
            <p className="text-sm text-muted">{review.comentario}</p>
          )}
        </div>
      ))}
    </div>
  );
}

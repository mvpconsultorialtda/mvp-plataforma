import { FileX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "Nenhum item encontrado." }: EmptyStateProps) {
  return (
    <div className="text-center py-16 text-muted">
      <FileX size={48} className="mx-auto mb-4 opacity-50" />
      <p>{message}</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useCollection } from "@/hooks/use-collection";
import { updateDoc } from "@/lib/firestore";
import { useMock } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Invitation, InvitationStatus } from "@/lib/types";
import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";

const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "inv-1",
    email: "maria@escola.edu.br",
    projeto: "educahubplay",
    justificativa: "Sou professora de matemática e gostaria de usar a plataforma com meus alunos.",
    status: "pendente",
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "inv-2",
    email: "joao@gamedev.com",
    projeto: "2altos",
    justificativa: "Designer de jogos independente buscando publicar meu primeiro jogo de tabuleiro.",
    status: "aprovado",
    approvedBy: "admin-1",
    createdAt: "2026-02-20T14:30:00Z",
  },
  {
    id: "inv-3",
    email: "ana@educacao.org",
    projeto: "xequemath",
    justificativa: "Coordenadora pedagógica interessada em jogos matemáticos para o ensino fundamental.",
    status: "rejeitado",
    approvedBy: "admin-1",
    createdAt: "2026-02-15T09:00:00Z",
  },
];

const statusConfig: Record<InvitationStatus, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "#ca8a04" },
  aprovado: { label: "Aprovado", color: "#16a34a" },
  rejeitado: { label: "Rejeitado", color: "#dc2626" },
};

export default function AdminConvitesPage() {
  const { user } = useAuth();
  const { data: invitations, loading, refetch } = useCollection<Invitation>("invitations", {
    mockData: MOCK_INVITATIONS,
  });
  const [localInvitations, setLocalInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [updating, setUpdating] = useState<string | null>(null);

  const displayData = useMock ? localInvitations : invitations;

  async function handleAction(id: string, newStatus: "aprovado" | "rejeitado") {
    setUpdating(id);
    try {
      if (useMock) {
        setLocalInvitations((prev) =>
          prev.map((inv) =>
            inv.id === id ? { ...inv, status: newStatus, approvedBy: user?.id } : inv
          )
        );
      } else {
        await updateDoc("invitations", id, {
          status: newStatus,
          approvedBy: user?.id,
        });
        refetch();
      }
    } catch (err) {
      console.error("Erro ao atualizar convite:", err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Convites</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : displayData.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted">Nenhum convite encontrado.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-muted font-medium">Email</th>
                    <th className="px-4 py-3 text-muted font-medium">Projeto</th>
                    <th className="px-4 py-3 text-muted font-medium">Justificativa</th>
                    <th className="px-4 py-3 text-muted font-medium">Status</th>
                    <th className="px-4 py-3 text-muted font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((inv) => {
                    const cfg = statusConfig[inv.status];
                    return (
                      <tr key={inv.id} className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-foreground font-medium">{inv.email}</td>
                        <td className="px-4 py-3 text-muted">{inv.projeto}</td>
                        <td className="px-4 py-3 text-muted max-w-xs truncate">
                          {inv.justificativa || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge color={cfg.color}>{cfg.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {inv.status === "pendente" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAction(inv.id, "aprovado")}
                                disabled={updating === inv.id}
                              >
                                <Check className="w-4 h-4" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleAction(inv.id, "rejeitado")}
                                disabled={updating === inv.id}
                              >
                                <X className="w-4 h-4" />
                                Rejeitar
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

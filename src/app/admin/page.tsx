"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useMock } from "@/lib/firebase";
import { Shield, Mail, Tag } from "lucide-react";

const adminLinks = [
  {
    href: "/admin/convites",
    label: "Gerenciar Convites",
    description: "Aprovar ou rejeitar solicitações de acesso aos projetos",
    icon: Mail,
  },
  {
    href: "/admin/categorias",
    label: "Gerenciar Categorias",
    description: "Criar e remover categorias de campanhas, jogos, serviços e trocas",
    icon: Tag,
  },
];

export default function AdminPage() {
  const { fullUser } = useAuth();
  const isAdmin = useMock || fullUser?.role === "admin";

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isAdmin ? (
          <div className="bg-card border border-red-500/30 rounded-lg p-8 text-center">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">Acesso Negado</h1>
            <p className="text-muted">
              Você não tem permissão para acessar esta área. Apenas administradores podem
              gerenciar a plataforma.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
              </div>
              <p className="text-muted text-sm">
                Área restrita para administradores da plataforma.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
                >
                  <link.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h2 className="text-lg font-semibold text-foreground mb-1">{link.label}</h2>
                  <p className="text-muted text-sm">{link.description}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

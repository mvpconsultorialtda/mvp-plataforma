"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMock } from "@/lib/firebase";
import { getDocById } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, Mail, Phone, Globe } from "lucide-react";
import Link from "next/link";
import type { ServiceProvider } from "@/lib/types";

export default function EducadorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (useMock) {
        // No mock data for xequemath educators yet - show placeholder
        setService({
          id,
          nome: "Educador Exemplo",
          descricao: "Este e um educador de exemplo. Dados reais serao carregados quando o Firebase estiver configurado.",
          categoria: "Matematica",
          tags: ["ENEM", "Olimpiadas"],
          localizacao: "Sao Paulo, SP",
          contato: {
            email: "educador@email.com",
            telefone: "(11) 99999-9999",
            site: "https://exemplo.com",
          },
          userId: "mock-1",
          projeto: "xequemath",
          avaliacao: 4.9,
          numAvaliacoes: 15,
          portfolio: [],
          destaque: false,
          status: "ativo",
          createdAt: new Date().toISOString(),
        });
      } else {
        const doc = await getDocById<ServiceProvider>("services", id);
        setService(doc);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted">Educador nao encontrado.</p>
        <Link href="/xequemath/educadores" className="text-emerald-400 hover:underline text-sm">
          Voltar para Educadores
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/xequemath/educadores"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Educadores
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{service.nome}</h1>
            <Badge color="#10b981">{service.categoria}</Badge>
          </div>

          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-sm">{service.avaliacao}</span>
            <span className="text-xs text-muted">({service.numAvaliacoes} avaliacoes)</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/80">{service.descricao}</p>

        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <Badge key={tag} className="bg-emerald-500/10 text-emerald-400">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {service.localizacao && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <MapPin size={16} />
              <span>{service.localizacao}</span>
            </div>
          )}

          {service.contato?.email && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Mail size={16} />
              <a href={`mailto:${service.contato.email}`} className="hover:text-emerald-400">
                {service.contato.email}
              </a>
            </div>
          )}

          {service.contato?.telefone && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Phone size={16} />
              <span>{service.contato.telefone}</span>
            </div>
          )}

          {service.contato?.site && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Globe size={16} />
              <a href={service.contato.site} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                {service.contato.site}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

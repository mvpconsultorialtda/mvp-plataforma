"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceInput } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { useMock } from "@/lib/firebase";
import { createDoc } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const categorias = [
  "Pedagogia",
  "Design Instrucional",
  "Game Design",
  "Ilustracao",
  "Programacao",
  "Consultoria",
];

const inputClass =
  "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-violet-500";

function CadastrarEspecialistaContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
  });

  const onSubmit = async (data: ServiceInput) => {
    setSaving(true);
    try {
      if (useMock) {
        alert("Especialista cadastrado com sucesso! (mock)");
        router.push("/educahubplay/especialistas");
        return;
      }

      const tags = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createDoc("services", {
        nome: data.nome,
        descricao: data.descricao,
        categoria: data.categoria,
        tags,
        localizacao: data.localizacao || "",
        contato: {
          email: data.email || "",
          telefone: data.telefone || "",
          site: data.site || "",
        },
        userId: user?.id ?? "",
        projeto: "educahubplay",
        avaliacao: 0,
        numAvaliacoes: 0,
        portfolio: [],
        destaque: false,
        status: "ativo",
      });
      router.push("/educahubplay/especialistas");
    } catch (err) {
      console.error("Erro ao cadastrar especialista:", err);
      alert("Erro ao cadastrar especialista. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/educahubplay/especialistas"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Voltar para Especialistas
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Cadastrar Especialista</h1>
          <p className="text-sm text-muted">Registre um especialista para a comunidade educacional</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nome *</label>
            <input type="text" {...register("nome")} className={inputClass} placeholder="Nome do especialista" />
            {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descricao *</label>
            <textarea
              {...register("descricao")}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Descreva a especialidade..."
            />
            {errors.descricao && <p className="text-red-400 text-xs mt-1">{errors.descricao.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Categoria *</label>
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
            <label className="block text-sm font-medium mb-1.5">Tags *</label>
            <input
              type="text"
              {...register("tags")}
              className={inputClass}
              placeholder="Separadas por virgula: Gamificacao, E-learning, BNCC"
            />
            {errors.tags && <p className="text-red-400 text-xs mt-1">{errors.tags.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Localizacao</label>
            <input
              type="text"
              {...register("localizacao")}
              className={inputClass}
              placeholder="Ex: Sao Paulo, SP"
            />
            {errors.localizacao && <p className="text-red-400 text-xs mt-1">{errors.localizacao.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" {...register("email")} className={inputClass} placeholder="contato@email.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Telefone</label>
              <input type="text" {...register("telefone")} className={inputClass} placeholder="(11) 99999-9999" />
              {errors.telefone && <p className="text-red-400 text-xs mt-1">{errors.telefone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Site</label>
            <input type="text" {...register("site")} className={inputClass} placeholder="https://meusite.com" />
            {errors.site && <p className="text-red-400 text-xs mt-1">{errors.site.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            <Save size={18} /> {saving ? "Salvando..." : "Cadastrar Especialista"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function CadastrarEspecialistaPage() {
  return (
    <ProtectedRoute>
      <CadastrarEspecialistaContent />
    </ProtectedRoute>
  );
}

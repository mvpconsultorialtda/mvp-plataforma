"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, CheckCircle } from "lucide-react";
import { invitationSchema, type InvitationInput } from "@/lib/schemas";
import { useMock } from "@/lib/firebase";
import { createDoc } from "@/lib/firestore";
import { Button } from "@/components/ui/button";

export default function ConvitePage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitationInput>({
    resolver: zodResolver(invitationSchema),
  });

  async function onSubmit(data: InvitationInput) {
    if (useMock) {
      await new Promise((r) => setTimeout(r, 600));
    } else {
      await createDoc("invitations", {
        email: data.email,
        justificativa: data.justificativa ?? "",
        projeto: "educahubplay",
        status: "pendente",
      });
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <CheckCircle size={48} className="mx-auto" style={{ color: "#22c55e" }} />
          <h2 className="text-xl font-bold">Convite solicitado!</h2>
          <p className="text-muted text-sm">
            Sua solicitação foi enviada. Você receberá um e-mail quando seu acesso for aprovado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Mail size={40} className="mx-auto" style={{ color: "#8b5cf6" }} />
          <h1 className="text-2xl font-bold">Solicitar Convite</h1>
          <p className="text-muted text-sm">
            Acesso à plataforma EducaHubPlay é por convite para educadores da UNEB.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span style={{ color: "#8b5cf6" }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs" style={{ color: "#ef4444" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="justificativa" className="text-sm font-medium">
              Justificativa{" "}
              <span className="text-muted text-xs font-normal">(opcional, máx. 500 caracteres)</span>
            </label>
            <textarea
              id="justificativa"
              rows={4}
              placeholder="Conte-nos por que deseja acessar a plataforma..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
              {...register("justificativa")}
            />
            {errors.justificativa && (
              <p className="text-xs" style={{ color: "#ef4444" }}>
                {errors.justificativa.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            style={{ backgroundColor: "#8b5cf6" }}
          >
            {isSubmitting ? "Enviando..." : "Solicitar Convite"}
          </Button>
        </form>
      </div>
    </div>
  );
}

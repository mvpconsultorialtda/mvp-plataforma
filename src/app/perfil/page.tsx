"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/schemas";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { Save } from "lucide-react";

function PerfilContent() {
  const { user, fullUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (fullUser) {
      reset({
        name: fullUser.name || "",
        bio: fullUser.bio || "",
        location: fullUser.location || "",
        pixKey: fullUser.pixKey || "",
      });
    } else if (user) {
      reset({
        name: user.name || "",
        bio: "",
        location: "",
        pixKey: "",
      });
    }
  }, [fullUser, user, reset]);

  const onSubmit = async (data: ProfileInput) => {
    // TODO: integrate with Firebase updateDoc when not in mock mode
    console.log("Profile update:", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-sm text-muted">Atualize suas informações</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-muted cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Nome</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Conte um pouco sobre você..."
            />
            {errors.bio && (
              <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Localização</label>
            <input
              type="text"
              {...register("location")}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: São Paulo, SP"
            />
            {errors.location && (
              <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Chave Pix</label>
            <input
              type="text"
              {...register("pixKey")}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              placeholder="CPF, email, telefone ou chave aleatória"
            />
            {errors.pixKey && (
              <p className="text-red-400 text-xs mt-1">{errors.pixKey.message}</p>
            )}
          </div>

          {saved && (
            <p className="text-green-400 text-sm text-center">Perfil salvo com sucesso!</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            <Save size={18} /> Salvar Perfil
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <PerfilContent />
    </ProtectedRoute>
  );
}

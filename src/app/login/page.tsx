"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("carlos@mvp.com.br");
  const [password, setPassword] = useState("demo");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-sm text-muted">Acesse a plataforma MVP</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            <LogIn size={18} /> Entrar
          </Button>
        </form>
        <p className="text-xs text-muted text-center">
          Demo: qualquer email/senha funciona
        </p>
      </div>
    </div>
  );
}

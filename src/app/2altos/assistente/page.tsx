import { Bot } from "lucide-react";

export default function AssistentePage() {
  return (
    <div className="text-center py-20 space-y-4">
      <Bot size={48} className="mx-auto text-amber-500" />
      <h1 className="text-2xl font-bold">Assistente IA</h1>
      <p className="text-muted">Crie materiais graficos, balanceie mecanicas e gere ideias com IA.</p>
      <p className="text-sm text-muted">Requer integracao com API de IA (Fase 4)</p>
    </div>
  );
}

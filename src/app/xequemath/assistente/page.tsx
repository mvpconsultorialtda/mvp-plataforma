import { Bot } from "lucide-react";
export default function AssistenteMathPage() {
  return (
    <div className="text-center py-20 space-y-4">
      <Bot size={48} className="mx-auto text-emerald-500" />
      <h1 className="text-2xl font-bold">Assistente IA</h1>
      <p className="text-muted">Resolva problemas, gere exercicios, crie material grafico de matematica.</p>
      <p className="text-sm text-muted">Requer integracao com API de IA (Fase 4)</p>
    </div>
  );
}

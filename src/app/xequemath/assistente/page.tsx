"use client";

import { AIChat } from "@/components/shared/ai-chat";

const suggestions = [
  "Crie 5 exercícios de frações para 6º ano alinhados à BNCC",
  "Sugira um jogo para ensinar equações do 1º grau",
  "Monte um plano de aula gamificado sobre geometria",
  "Como tornar probabilidade divertida para o ensino médio?",
];

export default function AssistenteMathPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Assistente IA</h1>
        <p className="text-muted text-sm">Gere exercícios, crie jogos matemáticos e planos de aula gamificados</p>
      </div>
      <AIChat
        platform="xequemath"
        accentColor="#10b981"
        placeholder="Ex: Crie uma atividade lúdica para ensinar multiplicação no 4º ano..."
        suggestions={suggestions}
      />
    </div>
  );
}

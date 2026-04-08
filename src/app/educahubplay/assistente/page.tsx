"use client";

import { AIChat } from "@/components/shared/ai-chat";

const suggestions = [
  "Crie um roteiro pedagógico para jogo sobre ciclo da água",
  "Sugira dinâmicas de grupo gamificadas para aula de história",
  "Monte um plano de aula com jogos para educação infantil",
  "Como avaliar aprendizagem através de jogos educacionais?",
];

export default function AssistentePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Assistente IA</h1>
        <p className="text-muted text-sm">Gere material pedagógico, planos de aula e roteiros de jogos educacionais</p>
      </div>
      <AIChat
        platform="educahubplay"
        accentColor="#8b5cf6"
        placeholder="Ex: Crie um jogo educacional sobre alimentação saudável para crianças de 6-8 anos..."
        suggestions={suggestions}
      />
    </div>
  );
}

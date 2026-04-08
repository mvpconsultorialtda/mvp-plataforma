"use client";

import { AIChat } from "@/components/shared/ai-chat";

const suggestions = [
  "Crie um GDD para um jogo cooperativo sobre sustentabilidade",
  "Sugira mecânicas para um jogo educativo de 2-4 jogadores",
  "Descrição para campanha de crowdfunding de jogo de estratégia",
  "Como balancear pontuação para um jogo infantil?",
];

export default function AssistentePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Assistente IA</h1>
        <p className="text-muted text-sm">Crie materiais, balanceie mecânicas e gere ideias para jogos de tabuleiro</p>
      </div>
      <AIChat
        platform="2altos"
        accentColor="#f59e0b"
        placeholder="Ex: Crie um jogo cooperativo sobre reciclagem para crianças de 8-12 anos..."
        suggestions={suggestions}
      />
    </div>
  );
}

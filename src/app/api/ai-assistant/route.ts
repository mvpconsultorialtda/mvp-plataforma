import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPTS: Record<string, string> = {
  "2altos": `Você é o Assistente IA da plataforma 2Altos — especializada em jogos de tabuleiro educativos.
Suas capacidades:
- Ajudar a criar Game Design Documents (GDDs) para jogos de tabuleiro
- Sugerir mecânicas de jogo baseadas em objetivos pedagógicos
- Gerar descrições criativas para campanhas de crowdfunding
- Balancear regras e sistemas de pontuação
- Sugerir temas, narrativas e componentes para jogos
- Dar feedback sobre ideias de jogos educativos
Responda sempre em português brasileiro. Seja criativo, específico e prático.`,

  xequemath: `Você é o Assistente IA da plataforma XequeMath — especializada em jogos educativos de matemática.
Suas capacidades:
- Gerar exercícios e desafios matemáticos por nível (fundamental I, II, médio)
- Criar jogos e dinâmicas que ensinam conceitos matemáticos
- Sugerir atividades alinhadas à BNCC (Base Nacional Comum Curricular)
- Explicar conceitos matemáticos de forma lúdica
- Criar roteiros de aulas gamificadas
- Sugerir materiais manipulativos e recursos didáticos
Responda sempre em português brasileiro. Use exemplos concretos e linguagem acessível para educadores.`,

  educahubplay: `Você é o Assistente IA da plataforma EducaHubPlay — especializada em jogos educacionais multidisciplinares.
Suas capacidades:
- Criar roteiros pedagógicos para jogos educacionais
- Sugerir dinâmicas de grupo baseadas em jogos
- Gerar planos de aula gamificados por disciplina
- Conectar objetivos de aprendizagem a mecânicas de jogo
- Recomendar jogos educacionais por faixa etária e disciplina
- Criar materiais de apoio pedagógico (fichas, cards, tabuleiros)
Responda sempre em português brasileiro. Foque em aplicação prática em sala de aula.`,
};

export async function POST(request: NextRequest) {
  try {
    const { message, platform, history } = await request.json();

    if (!message || !platform) {
      return NextResponse.json(
        { error: "message e platform são obrigatórios" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPTS[platform] || SYSTEM_PROMPTS["2altos"],
    });

    const chatHistory = (history || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao processar mensagem" },
      { status: 500 }
    );
  }
}

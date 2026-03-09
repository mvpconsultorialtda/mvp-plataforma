/**
 * Seed script — popula o Firestore com dados iniciais dos JSONs em src/data/
 *
 * Uso:  pnpm seed          (ou npx tsx src/scripts/seed.ts)
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

// ─── Firebase Config ─────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "0",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "placeholder",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// ─── Helpers ─────────────────────────────────────────────

function loadJson<T>(relativePath: string): T[] {
  const fullPath = resolve(__dirname, "..", "data", relativePath);
  const raw = readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T[];
}

async function seedCollection(
  collectionName: string,
  docs: Record<string, unknown>[]
): Promise<number> {
  let count = 0;
  for (const doc of docs) {
    await addDoc(collection(db, collectionName), {
      ...doc,
      createdAt: Timestamp.now(),
    });
    count++;
  }
  return count;
}

// ─── Data Definitions ────────────────────────────────────

interface RawCampaign {
  id: string;
  titulo: string;
  criador: string;
  descricao: string;
  meta: number;
  arrecadado: number;
  percentual: number;
  diasRestantes: number;
  categoria: string;
}

interface RawGame {
  id: string;
  titulo: string;
  criador: string;
  descricao: string;
  preco?: number;
  avaliacao: number;
  numAvaliacoes: number;
  categoria: string;
  faixaEtaria?: string;
}

interface RawService {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  avaliacao: number;
  numAvaliacoes: number;
  tags: string[];
  localizacao: string;
}

type ProjectSlug = "2altos" | "2altos-campanhas" | "educahubplay" | "xequemath";

function mapCampaign(raw: RawCampaign, projeto: ProjectSlug) {
  const { id: _id, criador, ...rest } = raw;
  return {
    ...rest,
    projeto,
    criadorId: "seed-user",
    criadorNome: criador,
    status: "ativa" as const,
    backers: Math.floor(Math.random() * 100) + 10,
    dataInicio: Timestamp.now(),
    dataFim: Timestamp.fromDate(
      new Date(Date.now() + rest.diasRestantes * 24 * 60 * 60 * 1000)
    ),
  };
}

function mapGame(raw: RawGame, projeto: ProjectSlug) {
  const { id: _id, criador, ...rest } = raw;
  return {
    ...rest,
    projeto,
    criadorId: "seed-user",
    criadorNome: criador,
    status: "publicado" as const,
    tipo: "tabuleiro" as const,
    tags: [],
    estoque: Math.floor(Math.random() * 50) + 5,
  };
}

function mapService(raw: RawService, projeto: ProjectSlug) {
  const { id: _id, ...rest } = raw;
  return {
    ...rest,
    projeto,
    userId: "seed-user",
    portfolio: [],
    destaque: false,
    status: "ativo" as const,
  };
}

// ─── Categories ──────────────────────────────────────────

const SEED_CATEGORIES = [
  { label: "Estratégia", color: "#3b82f6", projeto: "2altos", tipo: "campaign" },
  { label: "Cooperativo", color: "#8b5cf6", projeto: "2altos", tipo: "campaign" },
  { label: "Economia", color: "#f59e0b", projeto: "2altos", tipo: "campaign" },
  { label: "Combate", color: "#ef4444", projeto: "2altos", tipo: "campaign" },
  { label: "Educativo", color: "#10b981", projeto: "2altos", tipo: "campaign" },
  { label: "Construção", color: "#06b6d4", projeto: "2altos", tipo: "campaign" },
  { label: "Estratégia", color: "#3b82f6", projeto: "2altos", tipo: "game" },
  { label: "Economia", color: "#f59e0b", projeto: "2altos", tipo: "game" },
  { label: "Party", color: "#ec4899", projeto: "2altos", tipo: "game" },
  { label: "Cooperativo", color: "#8b5cf6", projeto: "2altos", tipo: "game" },
  { label: "Abstrato", color: "#6366f1", projeto: "2altos", tipo: "game" },
  { label: "Design Gráfico", color: "#ec4899", projeto: "2altos", tipo: "service" },
  { label: "Game Design", color: "#8b5cf6", projeto: "2altos", tipo: "service" },
  { label: "Impressão 3D", color: "#f59e0b", projeto: "2altos", tipo: "service" },
  { label: "Playtest", color: "#10b981", projeto: "2altos", tipo: "service" },
  { label: "Ciências", color: "#06b6d4", projeto: "educahubplay", tipo: "game" },
  { label: "Português", color: "#84cc16", projeto: "educahubplay", tipo: "game" },
  { label: "História", color: "#f97316", projeto: "educahubplay", tipo: "game" },
  { label: "Matemática", color: "#ef4444", projeto: "educahubplay", tipo: "game" },
  { label: "Geografia", color: "#14b8a6", projeto: "educahubplay", tipo: "game" },
  { label: "Aritmética", color: "#3b82f6", projeto: "xequemath", tipo: "campaign" },
  { label: "Álgebra", color: "#8b5cf6", projeto: "xequemath", tipo: "campaign" },
  { label: "Geometria", color: "#f59e0b", projeto: "xequemath", tipo: "campaign" },
  { label: "Financeira", color: "#10b981", projeto: "xequemath", tipo: "campaign" },
  { label: "Estatística", color: "#ec4899", projeto: "xequemath", tipo: "campaign" },
  { label: "Lógica", color: "#06b6d4", projeto: "xequemath", tipo: "campaign" },
];

// ─── Main ────────────────────────────────────────────────

async function main() {
  console.log("=== MVP Plataforma — Seed ===\n");

  // Campaigns
  const altosCampaigns = loadJson<RawCampaign>("2altos/campaigns.json").map((c) =>
    mapCampaign(c, "2altos")
  );
  const xequeCampaigns = loadJson<RawCampaign>("xequemath/campaigns.json").map((c) =>
    mapCampaign(c, "xequemath")
  );
  const allCampaigns = [...altosCampaigns, ...xequeCampaigns];
  const campaignCount = await seedCollection("campaigns", allCampaigns);
  console.log(`Seeding campaigns... ${campaignCount} docs`);

  // Games
  const altosGames = loadJson<RawGame>("2altos/games.json").map((g) =>
    mapGame(g, "2altos")
  );
  const educaGames = loadJson<RawGame>("educahubplay/games.json").map((g) =>
    mapGame(g, "educahubplay")
  );
  const allGames = [...altosGames, ...educaGames];
  const gameCount = await seedCollection("games", allGames);
  console.log(`Seeding games... ${gameCount} docs`);

  // Services
  const altosServices = loadJson<RawService>("2altos/services.json").map((s) =>
    mapService(s, "2altos")
  );
  const serviceCount = await seedCollection("services", altosServices);
  console.log(`Seeding services... ${serviceCount} docs`);

  // Categories
  const catCount = await seedCollection("categories", SEED_CATEGORIES);
  console.log(`Seeding categories... ${catCount} docs`);

  console.log(`\nDone! Total: ${campaignCount + gameCount + serviceCount + catCount} documents seeded.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

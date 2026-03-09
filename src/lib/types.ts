import type { Timestamp } from "firebase/firestore";

// ─── Base ────────────────────────────────────────────────

export type ProjectSlug = "2altos" | "2altos-campanhas" | "educahubplay" | "xequemath";

export interface ProjectRoute {
  path: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  slug: ProjectSlug;
  description: string;
  color: string;
  icon: string;
  routes: ProjectRoute[];
}

// ─── Users ───────────────────────────────────────────────

export type UserRole = "user" | "creator" | "educator" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  pixKey?: string;
  projects: string[];
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

// Versão simplificada para exibição e mock
export interface UserBasic {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ─── Campaigns ───────────────────────────────────────────

export type CampaignStatus = "rascunho" | "ativa" | "encerrada" | "cancelada";

export interface Campaign {
  id: string;
  titulo: string;
  descricao: string;
  criadorId: string;
  criadorNome: string;
  meta: number;
  arrecadado: number;
  percentual: number;
  dataInicio: Timestamp | string;
  dataFim: Timestamp | string;
  imagem?: string;
  categoria: string;
  faixaEtaria?: string;
  projeto: ProjectSlug;
  status: CampaignStatus;
  backers: number;
  createdAt: Timestamp | string;
  // Compat com mock antigo
  diasRestantes?: number;
  criador?: string;
}

// ─── Games ───────────────────────────────────────────────

export type GameStatus = "rascunho" | "publicado" | "removido";
export type GameType = "tabuleiro" | "educacional" | "digital";

export interface Game {
  id: string;
  titulo: string;
  descricao: string;
  criadorId: string;
  criadorNome: string;
  preco?: number;
  avaliacao: number;
  numAvaliacoes: number;
  imagem?: string;
  categoria: string;
  faixaEtaria?: string;
  projeto: ProjectSlug;
  tipo: GameType;
  estoque?: number;
  serie?: string;
  jogadores?: string;
  tempo?: string;
  complexidade?: string;
  tags: string[];
  status: GameStatus;
  createdAt: Timestamp | string;
  // Compat com mock antigo
  criador?: string;
}

// ─── Services ────────────────────────────────────────────

export interface ServiceContact {
  email?: string;
  telefone?: string;
  site?: string;
}

export interface ServiceProvider {
  id: string;
  userId: string;
  nome: string;
  descricao: string;
  categoria: string;
  avaliacao: number;
  numAvaliacoes: number;
  imagem?: string;
  tags: string[];
  localizacao?: string;
  portfolio: string[];
  contato?: ServiceContact;
  projeto: ProjectSlug;
  destaque: boolean;
  status: "ativo" | "inativo";
  createdAt: Timestamp | string;
}

// ─── Exchanges ───────────────────────────────────────────

export type ExchangeType = "venda" | "troca" | "doacao";
export type ExchangeCondition = "novo" | "seminovo" | "usado";
export type ExchangeStatus = "ativo" | "negociando" | "concluido" | "cancelado";

export interface Exchange {
  id: string;
  titulo: string;
  descricao: string;
  vendedorId: string;
  vendedorNome: string;
  preco?: number;
  tipo: ExchangeType;
  condicao: ExchangeCondition;
  imagem?: string;
  localizacao?: string;
  projeto: ProjectSlug;
  status: ExchangeStatus;
  createdAt: Timestamp | string;
}

// ─── Contributions ───────────────────────────────────────

export interface Contribution {
  id: string;
  campaignId: string;
  userId: string;
  valor: number;
  status: "pendente" | "confirmado" | "cancelado";
  createdAt: Timestamp | string;
}

// ─── Reviews ─────────────────────────────────────────────

export interface Review {
  id: string;
  targetId: string;
  targetType: "game" | "service";
  userId: string;
  userName?: string;
  nota: number;
  comentario?: string;
  createdAt: Timestamp | string;
}

// ─── Invitations ─────────────────────────────────────────

export type InvitationStatus = "pendente" | "aprovado" | "rejeitado";

export interface Invitation {
  id: string;
  email: string;
  justificativa?: string;
  projeto: ProjectSlug;
  status: InvitationStatus;
  approvedBy?: string;
  createdAt: Timestamp | string;
}

// ─── Categories ──────────────────────────────────────────

export type CategoryType = "campaign" | "game" | "service" | "exchange";

export interface Category {
  id: string;
  label: string;
  color: string;
  projeto?: ProjectSlug;
  tipo?: CategoryType;
}

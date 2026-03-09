import { z } from "zod/v4";

// ─── Auth ────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// ─── Profile ─────────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  bio: z.string().max(500, "Máximo 500 caracteres").optional(),
  location: z.string().optional(),
  pixKey: z.string().optional(),
});

// ─── Campaign ────────────────────────────────────────────

export const campaignSchema = z.object({
  titulo: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  descricao: z.string().min(10, "Mínimo 10 caracteres").max(2000, "Máximo 2000 caracteres"),
  meta: z.number().min(100, "Meta mínima R$ 100"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  faixaEtaria: z.string().optional(),
  dataFim: z.string().min(1, "Selecione uma data"),
});

// ─── Game ────────────────────────────────────────────────

export const gameSchema = z.object({
  titulo: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  descricao: z.string().min(10, "Mínimo 10 caracteres").max(2000, "Máximo 2000 caracteres"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  preco: z.number().min(0, "Preço não pode ser negativo").optional(),
  faixaEtaria: z.string().optional(),
  jogadores: z.string().optional(),
  tempo: z.string().optional(),
  complexidade: z.enum(["baixa", "media", "alta"]).optional(),
  serie: z.string().optional(),
});

// ─── Service ─────────────────────────────────────────────

export const serviceSchema = z.object({
  nome: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  descricao: z.string().min(10, "Mínimo 10 caracteres").max(1000, "Máximo 1000 caracteres"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  tags: z.string().min(1, "Adicione pelo menos uma tag"),
  localizacao: z.string().optional(),
  email: z.email("Email inválido").optional(),
  telefone: z.string().optional(),
  site: z.string().url("URL inválida").optional().or(z.literal("")),
});

// ─── Exchange ────────────────────────────────────────────

export const exchangeSchema = z.object({
  titulo: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  descricao: z.string().min(10, "Mínimo 10 caracteres").max(1000, "Máximo 1000 caracteres"),
  tipo: z.enum(["venda", "troca", "doacao"]),
  condicao: z.enum(["novo", "seminovo", "usado"]),
  preco: z.number().min(0).optional(),
  localizacao: z.string().optional(),
});

// ─── Invitation ──────────────────────────────────────────

export const invitationSchema = z.object({
  email: z.email("Email inválido"),
  justificativa: z.string().max(500, "Máximo 500 caracteres").optional(),
});

// ─── Review ──────────────────────────────────────────────

export const reviewSchema = z.object({
  nota: z.number().min(1, "Mínimo 1 estrela").max(5, "Máximo 5 estrelas"),
  comentario: z.string().max(500, "Máximo 500 caracteres").optional(),
});

// ─── Contribution ────────────────────────────────────────

export const contributionSchema = z.object({
  valor: z.number().min(5, "Apoio mínimo R$ 5"),
});

// ─── Types ───────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type GameInput = z.infer<typeof gameSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ExchangeInput = z.infer<typeof exchangeSchema>;
export type InvitationInput = z.infer<typeof invitationSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContributionInput = z.infer<typeof contributionSchema>;

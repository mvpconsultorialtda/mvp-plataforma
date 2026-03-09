export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  routes: ProjectRoute[];
}

export interface ProjectRoute {
  path: string;
  label: string;
}

export interface Campaign {
  id: string;
  titulo: string;
  criador: string;
  descricao: string;
  meta: number;
  arrecadado: number;
  percentual: number;
  diasRestantes: number;
  imagem?: string;
  categoria: string;
}

export interface Game {
  id: string;
  titulo: string;
  criador: string;
  descricao: string;
  preco?: number;
  avaliacao: number;
  numAvaliacoes: number;
  imagem?: string;
  categoria: string;
  faixaEtaria?: string;
}

export interface ServiceProvider {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  avaliacao: number;
  numAvaliacoes: number;
  imagem?: string;
  tags: string[];
  localizacao?: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

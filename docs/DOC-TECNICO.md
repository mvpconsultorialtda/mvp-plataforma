---
tipo: documentacao
criado: 2026-04-07
atualizado: 2026-04-07
tags: [tech, mvp-plataforma]
temas: [tech/mvp-plataforma]
modo: tech
---

# MVP Plataforma

## Visao Geral

Hub unificado de multiplos projetos-produto da MVP Consultoria. Plataforma web que centraliza quatro iniciativas distintas em uma unica base de codigo Next.js: **2Altos** (financiamento coletivo de jogos de tabuleiro), **2Altos Campanhas** (exploracao de campanhas), **EducaHubPlay** (plataforma colaborativa de jogos educacionais) e **XequeMath** (jogos educacionais de matematica).

Versao atual: `1.0.0`

## Modelo de Negocio

Cada sub-plataforma e um produto independente sob o mesmo teto tecnico:

| Projeto | Descricao | Perfil de usuario |
|---------|-----------|-------------------|
| 2Altos | Crowdfunding + loja de jogos de tabuleiro | Criadores, apoiadores, jogadores |
| 2Altos Campanhas | Exploracao de campanhas com filtros e tema | Publico geral |
| EducaHubPlay | Criacao colaborativa de jogos educacionais | Educadores, especialistas |
| XequeMath | Jogos de matematica com design futurista | Alunos, educadores |

Roles de usuario: `user`, `creator`, `educator`, `admin`.

## Stack Tecnologica

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Framework | Next.js (App Router) | ^16.1.6 |
| Linguagem | TypeScript | ^5.9.3 |
| UI | React | ^19.2.4 |
| Estilo | Tailwind CSS | ^4.2.1 |
| Formularios | react-hook-form + Zod | ^7.71.2 / ^4.3.6 |
| UI utilitarios | clsx, tailwind-merge, class-variance-authority | - |
| Icones | lucide-react | ^0.577.0 |
| Temas | next-themes | ^0.4.6 |
| Banco de dados | Firebase Firestore | ^12.10.0 |
| Auth | Firebase Auth | (via firebase SDK) |
| Package manager | pnpm | 10.28.1 |

## Arquitetura

```
mvp-plataforma
  src/
    app/                  — App Router Next.js
      page.tsx            — Hub principal (listagem dos 4 projetos)
      login/              — Autenticacao Firebase Auth
      register/           — Cadastro de usuario
      perfil/             — Perfil do usuario
      2altos/             — Sub-plataforma 2Altos
      2altos-campanhas/   — Sub-plataforma campanhas
      educahubplay/       — Sub-plataforma EducaHubPlay
      xequemath/          — Sub-plataforma XequeMath
      admin/              — Area administrativa
    components/           — Componentes reutilizaveis (UI, forms, layout)
    contexts/             — Context providers React (auth, theme, etc.)
    hooks/                — Custom hooks
    lib/                  — Firebase client, helpers
    data/                 — Dados estaticos / fixtures de desenvolvimento
    scripts/              — Scripts de seed
```

### Collections Firestore (9 colecoes)

| Collection | Conteudo principal |
|-----------|-------------------|
| `users` | Perfis de usuario (uid, name, email, role, pixKey, projects) |
| `campaigns` | Campanhas de financiamento (meta, arrecadado, status, projeto) |
| `games` | Jogos cadastrados (titulo, preco, avaliacao, categoria) |
| `educators` | Perfis de educadores |
| `specialists` | Especialistas do EducaHubPlay |
| `services` | Servicos ofertados na plataforma |
| `exchanges` | Permutas de jogos (2Altos) |
| `invites` | Convites para colaboracao |
| `notifications` | Notificacoes de usuarios |

Status de campanha: `rascunho`, `ativa`, `encerrada`, `cancelada`.

## Como Rodar Localmente

```bash
# Pre-requisito: credenciais Firebase em .env.local
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=mvp-geral

pnpm install
pnpm dev         # http://localhost:3000
pnpm seed        # Popular dados de demonstracao no Firestore
```

## Estrutura de Pastas

```
mvp-plataforma/
  src/
    app/          — Paginas por rota (App Router)
    components/   — Componentes de UI
    contexts/     — Context API (auth, tema)
    hooks/        — Custom hooks React
    lib/          — Firebase, utilidades
    data/         — Dados estaticos
    scripts/      — seed.ts
  public/         — Assets estaticos
  package.json
  tsconfig.json
  next.config.ts
  PLANEJAMENTO_FIREBASE.md  — Especificacao das collections Firestore
```

## APIs e Endpoints

Nao ha API propria. O app consome Firebase Firestore e Firebase Auth diretamente via SDK client-side. Formularios validados com Zod + react-hook-form antes de gravar no Firestore.

## Deploy

- Plataforma: **Vercel** (deploy automatico via push na branch master)
- Projeto Firebase: `mvp-geral` (compartilhado com outros repos MVP)
- Build: `next build`
- Variaveis obrigatorias no Vercel: credenciais Firebase (`NEXT_PUBLIC_FIREBASE_*`)

## Dependencias Externas

| Servico | Uso |
|---------|-----|
| Firebase Auth | Login e gestao de sessao |
| Firebase Firestore | Banco de dados de todos os projetos |
| Vercel | Hosting e CI/CD |

## Roadmap

- Integracao de pagamentos (PIX) para campanhas ativas
- Assistente IA integrado em cada sub-plataforma (feature listada no hub)
- Painel de metricas por projeto para o admin
- Avaliacao e comentarios de jogos (2Altos)
- Sistema de permutas completo com matching

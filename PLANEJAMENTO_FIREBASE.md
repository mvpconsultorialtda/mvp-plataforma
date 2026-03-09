# Planejamento: Mock Data → Firebase Real

**Data:** 08/03/2026
**Objetivo:** Migrar a plataforma de dados JSON estáticos para Firebase (Auth + Firestore), permitindo cadastro e persistência de dados reais.

**Princípio:** Tudo que eu (Claude) consigo fazer sozinho vem primeiro. Tudo que precisa de ação manual do usuário (criar projeto Firebase, colar credenciais, ativar Google Auth, deploy de regras) fica como pendência no final.

---

## Coleções Firestore (9 coleções)

### `users`
| Campo | Tipo | Descrição |
|---|---|---|
| `uid` | string (doc ID) | ID do Firebase Auth |
| `name` | string | Nome completo |
| `email` | string | Email |
| `avatar` | string? | URL da foto |
| `role` | string | `user` \| `creator` \| `educator` \| `admin` |
| `bio` | string? | Descrição do perfil |
| `location` | string? | Cidade/Estado |
| `pixKey` | string? | Chave PIX |
| `projects` | string[] | Projetos que participa |
| `createdAt` | timestamp | Data de criação |
| `updatedAt` | timestamp | Última atualização |

### `campaigns`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string (auto) | ID do documento |
| `titulo` | string | Nome da campanha |
| `descricao` | string | Descrição detalhada |
| `criadorId` | string | UID do criador |
| `criadorNome` | string | Nome denormalizado |
| `meta` | number | Valor meta R$ |
| `arrecadado` | number | Valor arrecadado |
| `percentual` | number | Calculado |
| `dataInicio` | timestamp | Início |
| `dataFim` | timestamp | Fim |
| `imagem` | string? | URL da capa |
| `categoria` | string | Categoria |
| `faixaEtaria` | string? | Faixa etária |
| `projeto` | string | `2altos` \| `xequemath` |
| `status` | string | `rascunho` \| `ativa` \| `encerrada` \| `cancelada` |
| `backers` | number | Apoiadores |
| `createdAt` | timestamp | Data |

### `games`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string (auto) | ID |
| `titulo` | string | Nome do jogo |
| `descricao` | string | Descrição |
| `criadorId` | string | UID do criador |
| `criadorNome` | string | Nome |
| `preco` | number? | R$ (null = gratuito) |
| `avaliacao` | number | Média 1-5 |
| `numAvaliacoes` | number | Total |
| `imagem` | string? | URL |
| `categoria` | string | Categoria |
| `faixaEtaria` | string? | Ex: "8-12 anos" |
| `projeto` | string | `2altos` \| `educahubplay` |
| `tipo` | string | `tabuleiro` \| `educacional` \| `digital` |
| `estoque` | number? | Qtd disponível |
| `serie` | string? | Série escolar |
| `jogadores` | string? | "2-4 jogadores" |
| `tempo` | string? | "30-60 min" |
| `complexidade` | string? | baixa/media/alta |
| `tags` | string[] | Tags |
| `status` | string | `rascunho` \| `publicado` \| `removido` |
| `createdAt` | timestamp | Data |

### `services`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string (auto) | ID |
| `userId` | string | UID do prestador |
| `nome` | string | Nome profissional |
| `descricao` | string | Descrição |
| `categoria` | string | Categoria |
| `avaliacao` | number | Média 1-5 |
| `numAvaliacoes` | number | Total |
| `imagem` | string? | Foto |
| `tags` | string[] | Habilidades |
| `localizacao` | string? | Cidade/Estado |
| `portfolio` | string[] | URLs |
| `contato` | object? | `{ email, telefone, site }` |
| `projeto` | string | `2altos` \| `educahubplay` \| `xequemath` |
| `destaque` | boolean | Em destaque |
| `status` | string | `ativo` \| `inativo` |
| `createdAt` | timestamp | Data |

### `exchanges`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string (auto) | ID |
| `titulo` | string | Título |
| `descricao` | string | Descrição |
| `vendedorId` | string | UID |
| `vendedorNome` | string | Nome |
| `preco` | number? | Preço (null = troca) |
| `tipo` | string | `venda` \| `troca` \| `doacao` |
| `condicao` | string | `novo` \| `seminovo` \| `usado` |
| `imagem` | string? | Foto |
| `localizacao` | string? | Local |
| `projeto` | string | `2altos` \| `xequemath` |
| `status` | string | `ativo` \| `negociando` \| `concluido` \| `cancelado` |
| `createdAt` | timestamp | Data |

### `contributions`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string (auto) | ID |
| `campaignId` | string | Ref → campaigns |
| `userId` | string | Ref → users |
| `valor` | number | Valor R$ |
| `status` | string | `pendente` \| `confirmado` \| `cancelado` |
| `createdAt` | timestamp | Data |

### `reviews`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string (auto) | ID |
| `targetId` | string | ID do jogo/serviço |
| `targetType` | string | `game` \| `service` |
| `userId` | string | Quem avaliou |
| `nota` | number | 1-5 |
| `comentario` | string? | Texto |
| `createdAt` | timestamp | Data |

### `invitations`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string (auto) | ID |
| `email` | string | Email |
| `justificativa` | string? | Motivo |
| `projeto` | string | `educahubplay` \| `xequemath` |
| `status` | string | `pendente` \| `aprovado` \| `rejeitado` |
| `approvedBy` | string? | UID admin |
| `createdAt` | timestamp | Data |

### `categories`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Slug |
| `label` | string | Nome exibido |
| `color` | string | Cor hex |
| `projeto` | string | Qual projeto |
| `tipo` | string | `campaign` \| `game` \| `service` \| `exchange` |

---

## Fases de Implementação

### FASE 1: Code-only — Lib, tipos, hooks, service layer (Claude faz sozinho)

Tudo puramente código. Não precisa de credenciais, não conecta em nada externo. Funciona com um Firebase config placeholder e um flag `USE_MOCK=true` para manter a app funcional durante o desenvolvimento.

| # | Feature | O que faz | Arquivos |
|---|---|---|---|
| 1.1 | **Tipos Firestore** | Interfaces TypeScript para todas as 9 coleções | `lib/types.ts` |
| 1.2 | **Firebase Config (placeholder)** | `initializeApp` com env vars, exporta `db`, `auth`, `storage`. Funciona mesmo sem credenciais reais (apenas não conecta) | `lib/firebase.ts` |
| 1.3 | **Firestore Service Layer** | Funções tipadas: `getDocById`, `queryDocs`, `createDoc`, `updateDoc`, `deleteDoc`, `uploadFile` | `lib/firestore.ts`, `lib/storage.ts` |
| 1.4 | **Data Provider Pattern** | Hook `useCollection` que decide: se `USE_MOCK=true` → retorna JSON local, se `false` → query Firestore. Assim nada quebra. | `hooks/use-collection.ts` |
| 1.5 | **Auth Context Dual-mode** | Refatorar AuthContext para suportar mock E Firebase Auth. Flag `USE_MOCK` controla qual usa. | `contexts/auth-context.tsx` |
| 1.6 | **Schemas Zod** | Validação de todos os formulários (campanha, jogo, serviço, troca, convite, perfil, login, registro) | `lib/schemas.ts` |
| 1.7 | **Auth Guard Component** | `<ProtectedRoute>` que redireciona para `/login` se não autenticado | `components/shared/protected-route.tsx` |
| 1.8 | **Dependências** | Instalar firebase, zod, react-hook-form, @hookform/resolvers | `package.json` |

### FASE 2: Code-only — Formulários CRUD (Claude faz sozinho)

Todas as telas de criar/editar. Usam os schemas Zod, react-hook-form, e chamam o service layer. Funcionam em mock mode (salvam no state/console.log) e em Firebase mode (salvam no Firestore).

| # | Feature | O que faz | Arquivos |
|---|---|---|---|
| 2.1 | **Tela de Registro** | Email + senha + nome, cria user | `app/register/page.tsx` |
| 2.2 | **Tela de Login** | Email/senha + botão Google (preparado) | `app/login/page.tsx` (refatorar) |
| 2.3 | **Tela de Perfil** | Editar nome, bio, avatar, localização, PIX | `app/perfil/page.tsx` |
| 2.4 | **Criar Campanha** | Form completo com validação | `app/2altos/campanhas/criar/page.tsx` |
| 2.5 | **Editar Campanha** | Carrega dados, permite alterar | `app/2altos/campanhas/[id]/editar/page.tsx` |
| 2.6 | **Detalhe Campanha** | Página [id] com info completa + botão apoiar | `app/2altos/campanhas/[id]/page.tsx` |
| 2.7 | **Cadastrar Jogo** | Form com campos por projeto (2altos vs educahubplay) | `app/2altos/loja/cadastrar/page.tsx`, `app/educahubplay/meus-jogos/criar/page.tsx` |
| 2.8 | **Editar Jogo** | Carrega, edita | `app/2altos/loja/[id]/editar/page.tsx` |
| 2.9 | **Detalhe Jogo** | Página [id] com avaliações | `app/2altos/loja/[id]/page.tsx` |
| 2.10 | **Cadastrar Serviço** | Form com tags, portfólio, contato | `app/2altos/servicos/cadastrar/page.tsx` |
| 2.11 | **Detalhe Serviço** | Perfil do prestador | `app/2altos/servicos/[id]/page.tsx` |
| 2.12 | **Criar Anúncio Troca** | Form tipo/condição/preço/foto | `app/2altos/troca/criar/page.tsx` |
| 2.13 | **Detalhe Anúncio** | Info + contato | `app/2altos/troca/[id]/page.tsx` |
| 2.14 | **Solicitar Convite** | Form email + justificativa (refatorar placeholder) | `app/educahubplay/convite/page.tsx` |

### FASE 3: Code-only — Migrar listagens de JSON para service layer (Claude faz sozinho)

Substituir `import data from "@/data/..."` por `useCollection()` nas páginas de listagem existentes. Em mock mode continua lendo JSON. Em Firebase mode faz query.

| # | Feature | Páginas afetadas |
|---|---|---|
| 3.1 | **Campanhas 2Altos** | `app/2altos/campanhas/page.tsx` |
| 3.2 | **Campanhas 2Altos-Campanhas** | `app/2altos-campanhas/campanhas/page.tsx` |
| 3.3 | **Campanhas XequeMath** | `app/xequemath/campanhas/page.tsx` |
| 3.4 | **Jogos 2Altos (Loja)** | `app/2altos/loja/page.tsx` |
| 3.5 | **Jogos 2Altos-Campanhas** | `app/2altos-campanhas/loja/page.tsx` |
| 3.6 | **Jogos EducaHubPlay** | `app/educahubplay/jogos/page.tsx` |
| 3.7 | **Serviços 2Altos** | `app/2altos/servicos/page.tsx` |
| 3.8 | **Serviços 2Altos-Campanhas** | `app/2altos-campanhas/servicos/page.tsx` |
| 3.9 | **Especialistas EducaHubPlay** | `app/educahubplay/especialistas/page.tsx` |
| 3.10 | **Educadores XequeMath** | `app/xequemath/educadores/page.tsx` |
| 3.11 | **Trocas 2Altos** | `app/2altos/troca/page.tsx` |
| 3.12 | **Trocas 2Altos-Campanhas** | `app/2altos-campanhas/troca/page.tsx` |
| 3.13 | **Permutas XequeMath** | `app/xequemath/permutas/page.tsx` |

### FASE 4: Code-only — Dashboards e features extras (Claude faz sozinho)

| # | Feature | O que faz | Arquivos |
|---|---|---|---|
| 4.1 | **Minhas Campanhas** | Lista campanhas do usuário logado | `app/2altos/minhas-campanhas/page.tsx` |
| 4.2 | **Meus Jogos** | Lista jogos do usuário logado | `app/2altos/meus-jogos/page.tsx`, `app/educahubplay/meus-jogos/page.tsx` |
| 4.3 | **Meus Serviços** | Lista serviços do usuário logado | `app/perfil/servicos/page.tsx` |
| 4.4 | **Meus Anúncios** | Lista trocas do usuário logado | `app/perfil/anuncios/page.tsx` |
| 4.5 | **Componente Avaliação** | Estrelas clicáveis + textarea + submit | `components/shared/review-form.tsx` |
| 4.6 | **Lista de Avaliações** | Exibir reviews num detalhe | `components/shared/review-list.tsx` |
| 4.7 | **Apoiar Campanha** | Modal com valor + confirmação | `components/shared/contribute-modal.tsx` |
| 4.8 | **Admin: Convites** | Tabela com aprovar/rejeitar | `app/admin/convites/page.tsx` |
| 4.9 | **Admin: Categorias** | CRUD categorias por projeto | `app/admin/categorias/page.tsx` |
| 4.10 | **Seed Script** | Popula Firestore com dados dos JSONs | `scripts/seed.ts` |
| 4.11 | **Upload de Imagens** | Componente de upload com preview | `components/shared/image-upload.tsx` |

### FASE 5: Code-only — Componentes compartilhados entre projetos (Claude faz sozinho)

Rotas do XequeMath e EducaHubPlay que reutilizam as mesmas features:

| # | Feature | O que faz |
|---|---|---|
| 5.1 | **XequeMath campanhas/criar** | Reutiliza form de campanha com `projeto=xequemath` |
| 5.2 | **XequeMath campanhas/[id]** | Detalhe de campanha xequemath |
| 5.3 | **EducaHubPlay especialistas/cadastrar** | Reutiliza form de serviço com `projeto=educahubplay` |
| 5.4 | **EducaHubPlay especialistas/[id]** | Detalhe de especialista |
| 5.5 | **XequeMath educadores/cadastrar** | Reutiliza form de serviço com `projeto=xequemath` |
| 5.6 | **XequeMath educadores/[id]** | Detalhe de educador |
| 5.7 | **XequeMath permutas/criar** | Reutiliza form de troca com `projeto=xequemath` |
| 5.8 | **XequeMath permutas/[id]** | Detalhe de permuta |

---

## PENDÊNCIAS — O que o usuário precisa fazer

Estas ações só são necessárias para sair do mock mode e conectar no Firebase real. Todo o código das Fases 1-5 funciona em mock mode sem isso.

### P1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um projeto (sugestão: `mvp-plataforma`)
3. Copie as credenciais do SDK Web (apiKey, authDomain, projectId, etc.)

### P2. Preencher `.env.local`
Colar as credenciais no arquivo `.env.local` que já estará criado:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=seu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_USE_MOCK=false
```

### P3. Ativar Authentication no Firebase
1. No Firebase Console → Authentication → Sign-in method
2. Ativar **Email/Senha**
3. Ativar **Google** (adicionar email autorizado)

### P4. Criar Firestore Database
1. Firebase Console → Firestore Database → Create database
2. Escolher modo **production**
3. Selecionar região (sugestão: `southamerica-east1`)

### P5. Deploy das Regras de Segurança
Copiar as regras abaixo no Firebase Console → Firestore → Rules → Publish:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /campaigns/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && resource.data.criadorId == request.auth.uid;
    }

    match /games/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && resource.data.criadorId == request.auth.uid;
    }

    match /services/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }

    match /exchanges/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && resource.data.vendedorId == request.auth.uid;
    }

    match /contributions/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if false;
    }

    match /reviews/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }

    match /invitations/{docId} {
      allow create: if true;
      allow read, update: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /categories/{docId} {
      allow read: if true;
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### P6. Ativar Firebase Storage
1. Firebase Console → Storage → Get started
2. Usar mesma região do Firestore

### P7. Rodar Seed Script
Após P1-P6 e `NEXT_PUBLIC_USE_MOCK=false`:
```bash
pnpm seed
```
Isso popula o Firestore com os dados dos JSONs atuais.

### P8. (Opcional) Ativar Google OAuth
Se quiser login com Google:
1. Firebase Console → Authentication → Sign-in method → Google → Enable
2. Adicionar domínio autorizado (localhost + domínio de produção)

---

## Resumo

| Métrica | Valor |
|---|---|
| **Coleções Firestore** | 9 |
| **Total de features** | 47 |
| **Fases code-only (Claude)** | 5 fases, 47 itens |
| **Pendências (usuário)** | 8 itens (P1-P8), todas no final |
| **Formulários CRUD** | 12 |
| **Páginas novas** | ~25 |
| **Páginas a migrar** | 13 |
| **Dependências novas** | 4 (firebase, zod, react-hook-form, @hookform/resolvers) |

### Fluxo de trabalho

```
FASE 1  Lib + tipos + hooks + service layer     ████████  (mock funciona)
FASE 2  Formulários CRUD completos               ██████████████  (mock funciona)
FASE 3  Migrar listagens JSON → service layer    ████████  (mock funciona)
FASE 4  Dashboards + avaliações + admin          ██████████  (mock funciona)
FASE 5  Rotas compartilhadas entre projetos      ██████  (mock funciona)
        ─── tudo acima funciona sem Firebase ───
PEND.   Configurar Firebase + credenciais        ████  (usuário faz)
        Trocar USE_MOCK=false + rodar seed       ██   (e tudo conecta)
```

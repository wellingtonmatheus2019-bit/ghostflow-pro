# GhostFlow - Monorepo Profissional

Projeto reestruturado para deploy escalável em produção.

## Estrutura

- `/frontend`: React + Vite + TypeScript (Deploy: Vercel)
- `/backend`: Express + tRPC + OAuth (Deploy: Railway)
- `/shared`: Types, Schemas e Utils compartilhados

## Como rodar localmente

1. Instale as dependências na raiz:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   - Copie `env.example` para `.env` no backend e preencha os valores.
   - Configure o `.env` do frontend se necessário.

3. Inicie o desenvolvimento:
   ```bash
   # Iniciar backend
   npm run backend:dev

   # Iniciar frontend
   npm run frontend:dev
   ```

## Deploy

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `frontend`

### Backend (Railway)
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Root Directory**: `backend`

## Variáveis de Ambiente Obrigatórias

Veja `env.example` para a lista completa de variáveis necessárias para o funcionamento do OAuth Instagram e Banco de Dados.

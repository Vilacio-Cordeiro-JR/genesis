# Genesis Admin

Painel administrativo (React 18, TypeScript, Tailwind CSS 4, Vite) para a Genesis API.

## Rodando

```bash
cp .env.example .env
npm install
npm run dev
```

Abre em `http://localhost:5174`. Adicione essa origem em `CORS_ORIGINS` no `.env` da API.

## Rotas

- `/login`
- `/admin/leads`
- `/admin/projetos`

Rotas `/admin/*` ficam atrás do `PrivateRoute`: sem token válido (ausente ou expirado), redireciona para `/login`.

## Estrutura

```
src/
  lib/          http (Axios + token), session (localStorage + exp do JWT), errors, format
  services/     auth, projects, quotes
  contexts/     AuthContext, ToastContext
  components/   layout, routes (PrivateRoute), ui (Modal, StatusBadge)
  pages/        login, leads, projects
  types/        contratos da API
```

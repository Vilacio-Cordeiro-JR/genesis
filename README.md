# Genesis

Monorepo com três aplicações:

| Pasta | O que é | Stack |
| --- | --- | --- |
| `frontend/` | Vitrine pública | Vite, React, TypeScript, Tailwind 3 |
| `admin/` | Painel administrativo | Vite, React, TypeScript, Tailwind 3 |
| `backend/genesis-api/` | API REST | Node, Express, TypeScript, MongoDB |

## Desenvolvimento

```bash
cd backend/genesis-api && cp .env.example .env && npm ci
npm run create-admin -- "Seu Nome" voce@genesis.com "senha-forte-123"
npm run dev

cd frontend && cp .env.example .env && npm ci && npm run dev
cd admin && cp .env.example .env && npm ci && npm run dev
```

`frontend` roda em `:5173` e `admin` em `:5174`. Ambos precisam estar em `CORS_ORIGINS` da API.

## Deploy

- **frontend** e **admin** (Vercel): defina *Root Directory* como `frontend` ou `admin`. Variáveis: `VITE_API_URL` (e `VITE_PUBLIC_API_KEY` na vitrine). O `vercel.json` de cada um já traz o fallback de SPA e os headers de segurança (CSP, HSTS, X-Frame-Options).
- **API** (Render, Railway, Fly ou VPS): `npm ci && npm run build`, start `npm start`. Variáveis em `.env.example`. A API não está preparada para funções serverless da Vercel.

## Sessão do admin

O JWT fica em cookie `HttpOnly` (8h), nunca no `localStorage`. Em produção o cookie sai com `Secure` e `SameSite=None`, necessário quando admin e API estão em domínios diferentes. Se estiverem no mesmo site (ex.: `admin.empresa.com` e `api.empresa.com`), defina `COOKIE_SAME_SITE=strict` ou `lax`. Requisições com cookie que alteram dados só passam se o `Origin` estiver em `CORS_ORIGINS`.

## Chave pública

`VITE_PUBLIC_API_KEY` vai no bundle da vitrine, então não é um segredo. Ela só filtra tráfego não intencional; a proteção real vem do rate limit, da validação e da sanitização no servidor.

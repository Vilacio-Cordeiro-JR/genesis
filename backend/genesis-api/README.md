# Genesis API

Node.js, Express, TypeScript e MongoDB (Mongoose), organizada em Clean Architecture.

## Estrutura

```
src/
  config/        env (validado com zod) e conexão com o MongoDB
  middlewares/   publicApiKey, auth (JWT), rateLimiters, errorHandler
  modules/
    projects|quotes|users/
      domain/        entidades e contratos de repositório
      application/   casos de uso (services)
      infra/         models Mongoose e repositórios Mongo
      http/          controllers e schemas de validação (zod)
  routes/        public, admin e index
  shared/        AppError, paginação, respostas, validação comum
  container.ts   composição das dependências
  app.ts         configuração do Express
  server.ts      bootstrap e shutdown gracioso
  scripts/       create-admin
```

## Como rodar

```bash
cp .env.example .env
npm install
npm run create-admin -- "Seu Nome" voce@genesis.com "senha-forte-123"
npm run dev
```

Produção: `npm run build && npm start`.

## Endpoints (`/api/v1`)

| Método | Rota | Acesso |
| --- | --- | --- |
| GET | `/public/projects?search&category&isPreset&page&limit` | `X-API-KEY` |
| GET | `/public/projects/:slug` | `X-API-KEY` |
| POST | `/public/quotes` | `X-API-KEY` |
| POST | `/admin/auth/login` | público |
| GET, POST | `/admin/projects` | JWT |
| PUT | `/admin/projects/:id` | JWT |
| DELETE | `/admin/projects/:id` | JWT (inativa; `?hard=true` exclui e exige SUPER_ADMIN) |
| GET | `/admin/quotes?status&page&limit` | JWT |
| PATCH | `/admin/quotes/:id/status` | JWT |

Respostas: `{ success: true, data, meta? }` ou `{ success: false, error, details? }`.

```bash
curl -H "X-API-KEY: $PUBLIC_API_KEY" "http://localhost:3333/api/v1/public/projects?isPreset=true"

curl -X POST http://localhost:3333/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@genesis.com","password":"senha-forte-123"}'
```

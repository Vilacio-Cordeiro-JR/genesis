import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

// As variáveis de ambiente precisam existir ANTES de qualquer import que
// carregue `config/env.ts` (ele valida e encerra o processo se faltar algo).
// Por isso usamos `import()` dinâmico para `app.ts`/`supertest` depois de
// garantir esses valores, em vez de `import` estático no topo do arquivo.
process.env.NODE_ENV ??= 'test';
process.env.MONGODB_URI ??= 'mongodb://localhost:27017/genesis-test';
process.env.JWT_SECRET ??= 'a'.repeat(40);
process.env.PUBLIC_API_KEY ??= 'b'.repeat(30);
process.env.CORS_ORIGINS ??= 'http://localhost:5173';

const TRUSTED_ORIGIN = process.env.CORS_ORIGINS.split(',')[0] ?? '';
const FAKE_QUOTE_ID = '507f1f77bcf86cd799439011';

const signAdminToken = (): string =>
  jwt.sign({ role: 'ADMIN' }, process.env.JWT_SECRET as string, {
    algorithm: 'HS256',
    subject: FAKE_QUOTE_ID,
    expiresIn: '1h',
  });

describe('Proteção CSRF do authMiddleware (integração HTTP)', () => {
  it('bloqueia requisição autenticada por cookie sem Origin/Referer confiável', async () => {
    const { createApp } = await import('../app');
    const request = (await import('supertest')).default;
    const app = createApp();

    const res = await request(app)
      .patch(`/api/v1/admin/quotes/${FAKE_QUOTE_ID}/status`)
      .set('Cookie', `jwt=${signAdminToken()}`)
      .send({ status: 'CONTACTED' });

    assert.equal(res.status, 403);
  });

  it('bloqueia quando o header Sec-Fetch-Site indica cross-site', async () => {
    const { createApp } = await import('../app');
    const request = (await import('supertest')).default;
    const app = createApp();

    const res = await request(app)
      .patch(`/api/v1/admin/quotes/${FAKE_QUOTE_ID}/status`)
      .set('Cookie', `jwt=${signAdminToken()}`)
      .set('Origin', TRUSTED_ORIGIN)
      .set('Sec-Fetch-Site', 'cross-site')
      .send({ status: 'CONTACTED' });

    assert.equal(res.status, 403);
  });

  it('não bloqueia por CSRF quando o Origin é confiável (segue até a validação de negócio)', async () => {
    const { createApp } = await import('../app');
    const request = (await import('supertest')).default;
    const app = createApp();

    const res = await request(app)
      .patch(`/api/v1/admin/quotes/${FAKE_QUOTE_ID}/status`)
      .set('Cookie', `jwt=${signAdminToken()}`)
      .set('Origin', TRUSTED_ORIGIN)
      .send({ status: 'STATUS_QUE_NAO_EXISTE' });

    assert.notEqual(res.status, 403);
    assert.equal(res.status, 400);
  });

  it('rejeita requisição sem token com 401, antes de qualquer checagem de CSRF', async () => {
    const { createApp } = await import('../app');
    const request = (await import('supertest')).default;
    const app = createApp();

    const res = await request(app).patch(`/api/v1/admin/quotes/${FAKE_QUOTE_ID}/status`).send({ status: 'CONTACTED' });

    assert.equal(res.status, 401);
  });
});

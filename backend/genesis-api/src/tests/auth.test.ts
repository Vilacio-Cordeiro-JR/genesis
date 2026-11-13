import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../modules/users/application/password';

describe('Autenticação e criptografia de senha', () => {
  it('gera hash bcrypt e confirma senha correta', async () => {
    const password = 'SenhaSuperForte!2026';
    const hash = await hashPassword(password);

    assert.ok(hash.startsWith('$2'), 'hash deve seguir o formato bcrypt');
    assert.equal(await verifyPassword(password, hash), true);
  });

  it('rejeita senha incorreta ou em branco', async () => {
    const hash = await hashPassword('valida-123');
    assert.equal(await verifyPassword('SenhaErrada', hash), false);
    assert.equal(await verifyPassword('', hash), false);
  });
});

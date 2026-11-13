import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { safeImageUrlSchema, safeUrlSchema, optionalObjectIdSchema } from '../shared/validation';
import { createQuoteSchema } from '../modules/quotes/http/quote.schemas';
import { createProjectSchema } from '../modules/projects/http/project.schemas';

describe('Esquemas de validação e sanitização', () => {
  describe('safeImageUrlSchema', () => {
    it('aceita URLs https, http e caminhos relativos', () => {
      assert.doesNotThrow(() => safeImageUrlSchema.parse('https://images.example.com/photo.png'));
      assert.doesNotThrow(() => safeImageUrlSchema.parse('http://localhost:3333/static/demo.png'));
      assert.doesNotThrow(() => safeImageUrlSchema.parse('/assets/sample.webp'));
    });

    it('rejeita esquemas perigosos como javascript: e data:', () => {
      assert.throws(() => safeImageUrlSchema.parse('javascript:alert(1)'));
      assert.throws(() => safeImageUrlSchema.parse('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='));
      assert.throws(() => safeImageUrlSchema.parse('vbscript:msgbox(1)'));
    });

    it('rejeita string vazia', () => {
      assert.throws(() => safeImageUrlSchema.parse(''));
    });
  });

  describe('safeUrlSchema e optionalObjectIdSchema', () => {
    it('converte string vazia em undefined', () => {
      assert.equal(safeUrlSchema.parse(''), undefined);
      assert.equal(optionalObjectIdSchema.parse(''), undefined);
    });

    it('aceita URL segura e rejeita URL com esquema perigoso', () => {
      assert.equal(safeUrlSchema.parse('https://example.com'), 'https://example.com');
      assert.throws(() => safeUrlSchema.parse('javascript:evil()'));
    });

    it('valida ObjectId de 24 caracteres hex', () => {
      const validId = '507f1f77bcf86cd799439011';
      assert.equal(optionalObjectIdSchema.parse(validId), validId);
      assert.throws(() => optionalObjectIdSchema.parse('invalido-123'));
    });
  });

  describe('createQuoteSchema', () => {
    const validBase = {
      clientName: 'João da Silva',
      clientEmail: 'joao@empresa.com.br',
      howDidYouKnow: 'Google',
      solutionType: 'Sistema Web',
      projectDescription: 'Preciso de um sistema para gestão interna e controle de inventário.',
    };

    it('aceita envio sem preset ou com preset vazio', () => {
      const parsed = createQuoteSchema.parse({ ...validBase, selectedPresetId: '' });
      assert.equal(parsed.selectedPresetId, undefined);
    });

    it('sanitiza tags HTML dos campos de texto', () => {
      const parsed = createQuoteSchema.parse({
        ...validBase,
        clientName: '<script>alert("xss")</script>Maria Souza',
      });
      assert.equal(parsed.clientName, 'alert("xss")Maria Souza');
    });

    it('rejeita email inválido', () => {
      assert.throws(() => createQuoteSchema.parse({ ...validBase, clientEmail: 'email-invalido' }));
    });
  });

  describe('createProjectSchema', () => {
    const validProject = {
      slug: 'sistema-gestao-2026',
      title: 'Sistema de Gestão 2026',
      category: 'Sistema Web',
      description: 'Plataforma administrativa desenvolvida sob medida para a empresa.',
      thumbnailUrl: 'https://cdn.example.com/projects/thumb-1.webp',
      demoUrl: 'https://demo.example.com/gestao',
      tags: ['react', 'node', 'mongodb'],
      features: ['Autenticação segura', 'Relatórios em PDF'],
    };

    it('valida projeto com dados corretos', () => {
      const parsed = createProjectSchema.parse(validProject);
      assert.equal(parsed.slug, 'sistema-gestao-2026');
    });

    it('rejeita slugs com caracteres inválidos', () => {
      assert.throws(() => createProjectSchema.parse({ ...validProject, slug: 'Slug Invalido!' }));
      assert.throws(() => createProjectSchema.parse({ ...validProject, slug: 'slug--duplo' }));
    });

    it('rejeita thumbnailUrl com protocolo inseguro', () => {
      assert.throws(() => createProjectSchema.parse({ ...validProject, thumbnailUrl: 'javascript:void(0)' }));
    });
  });
});

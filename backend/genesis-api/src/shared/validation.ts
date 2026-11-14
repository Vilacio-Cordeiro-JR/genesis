import { URL } from 'node:url';
import { z } from 'zod';

export const objectIdSchema = z.string().uuid('Identificador inválido');

export const optionalObjectIdSchema = z
  .string()
  .trim()
  .refine((val) => val === '' || z.string().uuid().safeParse(val).success, 'Identificador inválido')
  .transform((val) => (val === '' ? undefined : val))
  .optional();

const isHttpUrl = (val: string): boolean => {
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const safeUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((val) => val === '' || isHttpUrl(val), 'A URL deve iniciar com http:// ou https://')
  .transform((val) => (val === '' ? undefined : val))
  .optional();

export const safeImageUrlSchema = z
  .string()
  .trim()
  .min(1, 'Informe a URL da imagem')
  .max(500)
  .refine(
    (val) => val.startsWith('/') || isHttpUrl(val),
    'A URL da imagem deve iniciar com http://, https:// ou caminho relativo iniciado por /',
  );

export const idParamsSchema = z.object({ id: objectIdSchema });

export const booleanQuery = z.enum(['true', 'false']).transform((value) => value === 'true');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAGS = /<\/?[a-z!][^>]*>/gi;

export const sanitizePlainText = (value: string): string =>
  value.replace(CONTROL_CHARS, '').replace(HTML_TAGS, '').replace(/[<>]/g, '').trim();

export const plainText = (min: number, max: number) =>
  z.string().transform(sanitizePlainText).pipe(z.string().min(min).max(max));

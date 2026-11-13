import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador inválido');

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

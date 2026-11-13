import { z } from 'zod';
import { booleanQuery, paginationQuerySchema, safeImageUrlSchema, safeUrlSchema } from '../../../shared/validation';
import { PROJECT_CATEGORIES } from '../domain/project.entity';

const emptyToUndefined = (value: string | undefined): string | undefined => value || undefined;

export const slugParamsSchema = z.object({
  slug: z.string().trim().toLowerCase().min(1).max(100),
});

export const publicListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(100).optional().transform(emptyToUndefined),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  isPreset: booleanQuery.optional(),
});

export const adminListQuerySchema = publicListQuerySchema.extend({
  isActive: booleanQuery.optional(),
});

export const removeQuerySchema = z.object({
  hard: booleanQuery.optional(),
});

export const createProjectSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
    title: z.string().trim().min(3).max(160),
    category: z.enum(PROJECT_CATEGORIES),
    description: z.string().trim().min(10).max(2000),
    thumbnailUrl: safeImageUrlSchema,
    tags: z.array(z.string().trim().toLowerCase().min(1).max(40)).max(12).default([]),
    features: z.array(z.string().trim().min(1).max(160)).max(20).default([]),
    demoUrl: safeUrlSchema,
    isPreset: z.boolean().default(false),
    isActive: z.boolean().default(true),
  })
  .strict();

export const updateProjectSchema = createProjectSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'Informe ao menos um campo');

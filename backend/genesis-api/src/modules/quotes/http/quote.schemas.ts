import { z } from 'zod';
import { optionalObjectIdSchema, paginationQuerySchema, plainText } from '../../../shared/validation';
import { QUOTE_STATUSES } from '../domain/quote.entity';

export const createQuoteSchema = z
  .object({
    clientName: plainText(2, 120),
    clientEmail: z.string().trim().toLowerCase().email().max(160),
    companyName: plainText(0, 160).optional(),
    howDidYouKnow: plainText(1, 200),
    solutionType: plainText(2, 100),
    projectDescription: plainText(10, 3000),
    selectedPresetId: optionalObjectIdSchema,
  })
  .strict();

export const listQuotesQuerySchema = paginationQuerySchema.extend({
  status: z.enum(QUOTE_STATUSES).optional(),
});

export const updateQuoteStatusSchema = z
  .object({
    status: z.enum(QUOTE_STATUSES),
    notes: plainText(0, 2000).optional(),
  })
  .strict();

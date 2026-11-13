import type { Request, Response } from 'express';
import { sendOk, sendPage } from '../../../shared/response';
import { idParamsSchema } from '../../../shared/validation';
import type { QuoteService } from '../application/quote.service';
import { createQuoteSchema, listQuotesQuerySchema, updateQuoteStatusSchema } from './quote.schemas';

export class QuoteController {
  constructor(private readonly service: QuoteService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const quote = await this.service.create(createQuoteSchema.parse(req.body));
    sendOk(res, { id: quote.id, status: quote.status, createdAt: quote.createdAt }, 201);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { status, page, limit } = listQuotesQuerySchema.parse(req.query);
    sendPage(res, await this.service.list(status ? { status } : {}, { page, limit }));
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamsSchema.parse(req.params);
    sendOk(res, await this.service.updateStatus(id, updateQuoteStatusSchema.parse(req.body)));
  };

  metrics = async (_req: Request, res: Response): Promise<void> => {
    sendOk(res, await this.service.getMetrics());
  };
}

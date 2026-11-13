import { AppError } from '../../../shared/AppError';
import type { Paginated, Pagination } from '../../../shared/pagination';
import type { ProjectRepository } from '../../projects/domain/project.repository';
import type { NewQuote, Quote, QuoteMetrics, QuoteStatusUpdate } from '../domain/quote.entity';
import type { QuoteFilter, QuoteRepository } from '../domain/quote.repository';

export class QuoteService {
  constructor(
    private readonly quotes: QuoteRepository,
    private readonly projects: ProjectRepository,
  ) {}

  async create(data: NewQuote): Promise<Quote> {
    if (data.selectedPresetId) {
      const preset = await this.projects.findById(data.selectedPresetId);
      if (!preset || !preset.isPreset || !preset.isActive) {
        throw AppError.badRequest('Estilo selecionado inválido');
      }
    }
    return this.quotes.create(data);
  }

  list(filter: QuoteFilter, pagination: Pagination): Promise<Paginated<Quote>> {
    return this.quotes.list(filter, pagination);
  }

  async updateStatus(id: string, update: QuoteStatusUpdate): Promise<Quote> {
    const quote = await this.quotes.updateStatus(id, update);
    if (!quote) throw AppError.notFound('Orçamento não encontrado');
    return quote;
  }

  getMetrics(): Promise<QuoteMetrics> {
    return this.quotes.getMetrics();
  }
}

import type { Paginated, Pagination } from '../../../shared/pagination';
import type { NewQuote, Quote, QuoteStatus, QuoteStatusUpdate } from './quote.entity';

export interface QuoteFilter {
  status?: QuoteStatus;
}

export interface QuoteRepository {
  create(data: NewQuote): Promise<Quote>;
  list(filter: QuoteFilter, pagination: Pagination): Promise<Paginated<Quote>>;
  updateStatus(id: string, update: QuoteStatusUpdate): Promise<Quote | null>;
}

import { http } from '../lib/http';
import type { ApiPage, ApiSuccess, Quote, QuoteStatus } from '../types/api';

export interface QuotesPage {
  items: Quote[];
  total: number;
  totalPages: number;
}

export interface QuoteMetrics {
  total: number;
  pending: number;
  contactedThisMonth: number;
}

const fetchPage = (status: QuoteStatus | undefined, page: number, limit: number) =>
  http.get<ApiPage<Quote>>('/admin/quotes', { params: { status, page, limit } }).then((response) => response.data);

export const quotesService = {
  async list(status: QuoteStatus | undefined, page: number, limit = 10): Promise<QuotesPage> {
    const result = await fetchPage(status, page, limit);
    return { items: result.data, total: result.meta.total, totalPages: result.meta.totalPages };
  },

  async metrics(): Promise<QuoteMetrics> {
    const { data } = await http.get<ApiSuccess<QuoteMetrics>>('/admin/quotes/metrics');
    return data.data;
  },

  async updateStatus(id: string, status: QuoteStatus, notes: string): Promise<Quote> {
    const { data } = await http.patch<ApiSuccess<Quote>>(`/admin/quotes/${id}/status`, { status, notes });
    return data.data;
  },
};

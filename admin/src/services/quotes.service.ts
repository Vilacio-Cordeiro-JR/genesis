import { http } from '../lib/http';
import type { ApiPage, ApiSuccess, Quote, QuoteStatus } from '../types/api';
import { fetchAllPages } from './pagination';

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
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [total, pending, contacted] = await Promise.all([
      fetchPage(undefined, 1, 1),
      fetchPage('PENDING', 1, 1),
      fetchAllPages((page) => fetchPage('CONTACTED', page, 50)),
    ]);

    return {
      total: total.meta.total,
      pending: pending.meta.total,
      contactedThisMonth: contacted.filter((quote) => new Date(quote.updatedAt) >= monthStart).length,
    };
  },

  async updateStatus(id: string, status: QuoteStatus, notes: string): Promise<Quote> {
    const { data } = await http.patch<ApiSuccess<Quote>>(`/admin/quotes/${id}/status`, { status, notes });
    return data.data;
  },
};

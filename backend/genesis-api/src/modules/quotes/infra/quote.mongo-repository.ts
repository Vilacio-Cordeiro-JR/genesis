import type { FilterQuery } from 'mongoose';
import { buildPaginated, type Paginated, type Pagination } from '../../../shared/pagination';
import type { NewQuote, Quote, QuoteStatusUpdate } from '../domain/quote.entity';
import type { QuoteFilter, QuoteRepository } from '../domain/quote.repository';
import { QuoteModel, type QuoteDocument, type QuoteLean } from './quote.model';

const toQuote = (doc: QuoteLean): Quote => ({
  id: doc._id.toHexString(),
  clientName: doc.clientName,
  clientEmail: doc.clientEmail,
  ...(doc.companyName ? { companyName: doc.companyName } : {}),
  howDidYouKnow: doc.howDidYouKnow,
  solutionType: doc.solutionType,
  projectDescription: doc.projectDescription,
  ...(doc.selectedPresetId ? { selectedPresetId: doc.selectedPresetId.toHexString() } : {}),
  status: doc.status,
  ...(doc.notes ? { notes: doc.notes } : {}),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoQuoteRepository implements QuoteRepository {
  async create(data: NewQuote): Promise<Quote> {
    const created = await QuoteModel.create(data);
    return toQuote(created.toObject() as QuoteLean);
  }

  async list(filter: QuoteFilter, pagination: Pagination): Promise<Paginated<Quote>> {
    const query: FilterQuery<QuoteDocument> = {};
    if (filter.status) query.status = filter.status;

    const [docs, total] = await Promise.all([
      QuoteModel.find(query)
        .sort({ createdAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .lean<QuoteLean[]>(),
      QuoteModel.countDocuments(query),
    ]);

    return buildPaginated(docs.map(toQuote), total, pagination);
  }

  async updateStatus(id: string, { status, notes }: QuoteStatusUpdate): Promise<Quote | null> {
    const doc = await QuoteModel.findByIdAndUpdate(
      id,
      { $set: notes === undefined ? { status } : { status, notes } },
      { new: true, runValidators: true },
    ).lean<QuoteLean>();
    return doc ? toQuote(doc) : null;
  }
}

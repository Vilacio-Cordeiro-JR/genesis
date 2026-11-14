import { buildPaginated, type Paginated, type Pagination } from '../../../shared/pagination';
import { pool } from '../../../config/database';
import type { NewQuote, Quote, QuoteMetrics, QuoteStatus, QuoteStatusUpdate } from '../domain/quote.entity';
import type { QuoteFilter, QuoteRepository } from '../domain/quote.repository';

interface QuoteRow {
  id: string;
  client_name: string;
  client_email: string;
  company_name: string | null;
  how_did_you_know: string;
  solution_type: string;
  project_description: string;
  selected_preset_id: string | null;
  status: QuoteStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

const toQuote = (row: QuoteRow): Quote => ({
  id: row.id,
  clientName: row.client_name,
  clientEmail: row.client_email,
  ...(row.company_name ? { companyName: row.company_name } : {}),
  howDidYouKnow: row.how_did_you_know,
  solutionType: row.solution_type,
  projectDescription: row.project_description,
  ...(row.selected_preset_id ? { selectedPresetId: row.selected_preset_id } : {}),
  status: row.status,
  ...(row.notes ? { notes: row.notes } : {}),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class PgQuoteRepository implements QuoteRepository {
  async create(data: NewQuote): Promise<Quote> {
    const { rows } = await pool.query<QuoteRow>(
      `INSERT INTO quotes (client_name, client_email, company_name, how_did_you_know, solution_type, project_description, selected_preset_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.clientName,
        data.clientEmail,
        data.companyName ?? null,
        data.howDidYouKnow,
        data.solutionType,
        data.projectDescription,
        data.selectedPresetId ?? null,
      ],
    );
    return toQuote(rows[0]!);
  }

  async list(filter: QuoteFilter, pagination: Pagination): Promise<Paginated<Quote>> {
    const params: unknown[] = [];
    let where = '';
    if (filter.status) {
      params.push(filter.status);
      where = `WHERE status = $${params.length}`;
    }

    const limitIndex = params.length + 1;
    const offsetIndex = params.length + 2;

    const [listResult, countResult] = await Promise.all([
      pool.query<QuoteRow>(
        `SELECT * FROM quotes ${where} ORDER BY created_at DESC LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
        [...params, pagination.limit, (pagination.page - 1) * pagination.limit],
      ),
      pool.query<{ count: string }>(`SELECT count(*) FROM quotes ${where}`, params),
    ]);

    return buildPaginated(listResult.rows.map(toQuote), Number(countResult.rows[0]?.count ?? 0), pagination);
  }

  async updateStatus(id: string, { status, notes }: QuoteStatusUpdate): Promise<Quote | null> {
    const params: unknown[] = [status];
    let setNotes = '';
    if (notes !== undefined) {
      params.push(notes);
      setNotes = `, notes = $${params.length}`;
    }
    params.push(id);

    const { rows } = await pool.query<QuoteRow>(
      `UPDATE quotes SET status = $1${setNotes}, updated_at = now() WHERE id = $${params.length} RETURNING *`,
      params,
    );
    return rows[0] ? toQuote(rows[0]) : null;
  }

  async getMetrics(): Promise<QuoteMetrics> {
    const { rows } = await pool.query<{ total: string; pending: string; contacted_this_month: string }>(
      `SELECT
         count(*) AS total,
         count(*) FILTER (WHERE status = 'PENDING') AS pending,
         count(*) FILTER (WHERE status = 'CONTACTED' AND updated_at >= date_trunc('month', now())) AS contacted_this_month
       FROM quotes`,
    );
    const row = rows[0]!;
    return {
      total: Number(row.total),
      pending: Number(row.pending),
      contactedThisMonth: Number(row.contacted_this_month),
    };
  }
}

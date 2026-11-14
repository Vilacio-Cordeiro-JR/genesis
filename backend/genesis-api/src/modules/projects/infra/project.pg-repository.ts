import { buildPaginated, type Paginated, type Pagination } from '../../../shared/pagination';
import { pool } from '../../../config/database';
import type { Project, ProjectCategory, ProjectProps } from '../domain/project.entity';
import type { ProjectFilter, ProjectRepository } from '../domain/project.repository';

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  thumbnail_url: string;
  tags: string[];
  features: string[];
  demo_url: string | null;
  is_preset: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const toProject = (row: ProjectRow): Project => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  category: row.category,
  description: row.description,
  thumbnailUrl: row.thumbnail_url,
  tags: row.tags,
  features: row.features,
  ...(row.demo_url ? { demoUrl: row.demo_url } : {}),
  isPreset: row.is_preset,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const COLUMN_MAP: Record<keyof ProjectProps, string> = {
  slug: 'slug',
  title: 'title',
  category: 'category',
  description: 'description',
  thumbnailUrl: 'thumbnail_url',
  tags: 'tags',
  features: 'features',
  demoUrl: 'demo_url',
  isPreset: 'is_preset',
  isActive: 'is_active',
};

export class PgProjectRepository implements ProjectRepository {
  async list(filter: ProjectFilter, pagination: Pagination): Promise<Paginated<Project>> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filter.isActive !== undefined) {
      params.push(filter.isActive);
      conditions.push(`is_active = $${params.length}`);
    }
    if (filter.isPreset !== undefined) {
      params.push(filter.isPreset);
      conditions.push(`is_preset = $${params.length}`);
    }
    if (filter.category) {
      params.push(filter.category);
      conditions.push(`category = $${params.length}`);
    }

    let orderBy = 'created_at DESC';
    if (filter.search) {
      params.push(filter.search);
      const searchIndex = params.length;
      conditions.push(`search_vector @@ websearch_to_tsquery('portuguese', $${searchIndex})`);
      orderBy = `ts_rank(search_vector, websearch_to_tsquery('portuguese', $${searchIndex})) DESC, created_at DESC`;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitIndex = params.length + 1;
    const offsetIndex = params.length + 2;

    const [listResult, countResult] = await Promise.all([
      pool.query<ProjectRow>(
        `SELECT * FROM projects ${where} ORDER BY ${orderBy} LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
        [...params, pagination.limit, (pagination.page - 1) * pagination.limit],
      ),
      pool.query<{ count: string }>(`SELECT count(*) FROM projects ${where}`, params),
    ]);

    return buildPaginated(listResult.rows.map(toProject), Number(countResult.rows[0]?.count ?? 0), pagination);
  }

  async findBySlug(slug: string, isActive?: boolean): Promise<Project | null> {
    const conditions = ['slug = $1'];
    const params: unknown[] = [slug];
    if (isActive !== undefined) {
      params.push(isActive);
      conditions.push(`is_active = $${params.length}`);
    }
    const { rows } = await pool.query<ProjectRow>(`SELECT * FROM projects WHERE ${conditions.join(' AND ')}`, params);
    return rows[0] ? toProject(rows[0]) : null;
  }

  async findById(id: string): Promise<Project | null> {
    const { rows } = await pool.query<ProjectRow>('SELECT * FROM projects WHERE id = $1', [id]);
    return rows[0] ? toProject(rows[0]) : null;
  }

  async create(data: ProjectProps): Promise<Project> {
    const { rows } = await pool.query<ProjectRow>(
      `INSERT INTO projects (slug, title, category, description, thumbnail_url, tags, features, demo_url, is_preset, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.slug,
        data.title,
        data.category,
        data.description,
        data.thumbnailUrl,
        data.tags,
        data.features,
        data.demoUrl ?? null,
        data.isPreset,
        data.isActive,
      ],
    );
    return toProject(rows[0]!);
  }

  async update(id: string, data: Partial<ProjectProps>): Promise<Project | null> {
    const entries = Object.entries(data) as [keyof ProjectProps, ProjectProps[keyof ProjectProps]][];
    if (entries.length === 0) return this.findById(id);

    const params: unknown[] = [];
    const assignments = entries.map(([key, value]) => {
      params.push(value);
      return `${COLUMN_MAP[key]} = $${params.length}`;
    });
    params.push(id);

    const { rows } = await pool.query<ProjectRow>(
      `UPDATE projects SET ${assignments.join(', ')}, updated_at = now() WHERE id = $${params.length} RETURNING *`,
      params,
    );
    return rows[0] ? toProject(rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    return result.rowCount === 1;
  }
}

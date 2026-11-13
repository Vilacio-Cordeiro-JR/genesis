import type { FilterQuery } from 'mongoose';
import { buildPaginated, type Paginated, type Pagination } from '../../../shared/pagination';
import type { Project, ProjectProps } from '../domain/project.entity';
import type { ProjectFilter, ProjectRepository } from '../domain/project.repository';
import { ProjectModel, type ProjectDocument, type ProjectLean } from './project.model';

const toProject = (doc: ProjectLean): Project => ({
  id: doc._id.toHexString(),
  slug: doc.slug,
  title: doc.title,
  category: doc.category,
  description: doc.description,
  thumbnailUrl: doc.thumbnailUrl,
  tags: doc.tags,
  features: doc.features,
  ...(doc.demoUrl ? { demoUrl: doc.demoUrl } : {}),
  isPreset: doc.isPreset,
  isActive: doc.isActive,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoProjectRepository implements ProjectRepository {
  async list(filter: ProjectFilter, pagination: Pagination): Promise<Paginated<Project>> {
    const query: FilterQuery<ProjectDocument> = {};
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    if (filter.isPreset !== undefined) query.isPreset = filter.isPreset;
    if (filter.category) query.category = filter.category;
    if (filter.search) query.$text = { $search: filter.search, $language: 'portuguese' };

    const searching = Boolean(filter.search);
    const [docs, total] = await Promise.all([
      ProjectModel.find(query, searching ? { score: { $meta: 'textScore' } } : undefined)
        .sort(searching ? { score: { $meta: 'textScore' }, _id: -1 } : { createdAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .lean<ProjectLean[]>(),
      ProjectModel.countDocuments(query),
    ]);

    return buildPaginated(docs.map(toProject), total, pagination);
  }

  async findBySlug(slug: string, isActive?: boolean): Promise<Project | null> {
    const filter: FilterQuery<ProjectDocument> = { slug };
    if (isActive !== undefined) filter.isActive = isActive;
    const doc = await ProjectModel.findOne(filter).lean<ProjectLean>();
    return doc ? toProject(doc) : null;
  }

  async findById(id: string): Promise<Project | null> {
    const doc = await ProjectModel.findById(id).lean<ProjectLean>();
    return doc ? toProject(doc) : null;
  }

  async create(data: ProjectProps): Promise<Project> {
    const created = await ProjectModel.create(data);
    return toProject(created.toObject() as ProjectLean);
  }

  async update(id: string, data: Partial<ProjectProps>): Promise<Project | null> {
    const doc = await ProjectModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean<ProjectLean>();
    return doc ? toProject(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProjectModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}

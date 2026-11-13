import { AppError } from '../../../shared/AppError';
import type { Paginated, Pagination } from '../../../shared/pagination';
import type { Project, ProjectProps } from '../domain/project.entity';
import type { ProjectFilter, ProjectRepository } from '../domain/project.repository';

export type ListProjectsInput = Omit<ProjectFilter, 'isActive'> & Pagination;
export type ListAdminProjectsInput = ProjectFilter & Pagination;
export type RemoveMode = 'soft' | 'hard';

export class ProjectService {
  constructor(private readonly projects: ProjectRepository) {}

  listPublic({ page, limit, ...filter }: ListProjectsInput): Promise<Paginated<Project>> {
    return this.projects.list({ ...filter, isActive: true }, { page, limit });
  }

  async getPublicBySlug(slug: string): Promise<Project> {
    const project = await this.projects.findBySlug(slug, true);
    if (!project) throw AppError.notFound('Projeto não encontrado');
    return project;
  }

  listAdmin({ page, limit, ...filter }: ListAdminProjectsInput): Promise<Paginated<Project>> {
    return this.projects.list(filter, { page, limit });
  }

  create(data: ProjectProps): Promise<Project> {
    return this.projects.create(data);
  }

  async update(id: string, data: Partial<ProjectProps>): Promise<Project> {
    const project = await this.projects.update(id, data);
    if (!project) throw AppError.notFound('Projeto não encontrado');
    return project;
  }

  async remove(id: string, mode: RemoveMode): Promise<void> {
    if (mode === 'hard') {
      const deleted = await this.projects.delete(id);
      if (!deleted) throw AppError.notFound('Projeto não encontrado');
      return;
    }
    await this.update(id, { isActive: false });
  }
}

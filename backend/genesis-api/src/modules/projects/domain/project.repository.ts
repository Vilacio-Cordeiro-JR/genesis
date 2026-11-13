import type { Paginated, Pagination } from '../../../shared/pagination';
import type { Project, ProjectCategory, ProjectProps } from './project.entity';

export interface ProjectFilter {
  search?: string;
  category?: ProjectCategory;
  isActive?: boolean;
  isPreset?: boolean;
}

export interface ProjectRepository {
  list(filter: ProjectFilter, pagination: Pagination): Promise<Paginated<Project>>;
  findBySlug(slug: string, isActive?: boolean): Promise<Project | null>;
  findById(id: string): Promise<Project | null>;
  create(data: ProjectProps): Promise<Project>;
  update(id: string, data: Partial<ProjectProps>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

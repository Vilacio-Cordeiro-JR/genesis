import { http } from '../lib/http';
import type { ApiPage, ApiSuccess, Project, ProjectInput } from '../types/api';
import { fetchAllPages } from './pagination';

export const projectsService = {
  async listAll(): Promise<Project[]> {
    return fetchAllPages(async (page) => (await http.get<ApiPage<Project>>('/admin/projects', { params: { page, limit: 50 } })).data);
  },
  async create(input: ProjectInput): Promise<Project> {
    const { data } = await http.post<ApiSuccess<Project>>('/admin/projects', input);
    return data.data;
  },
  async update(id: string, input: Partial<ProjectInput>): Promise<Project> {
    const { data } = await http.put<ApiSuccess<Project>>(`/admin/projects/${id}`, input);
    return data.data;
  },
};

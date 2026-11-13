export const PROJECT_CATEGORIES = ['Landing Page', 'Sistema Web', 'API / Integração', 'Consultoria'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const QUOTE_STATUSES = ['PENDING', 'CONTACTED', 'ARCHIVED'] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AdminUser;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  features: string[];
  demoUrl?: string;
  isPreset: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export interface Quote {
  id: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  howDidYouKnow: string;
  solutionType: string;
  projectDescription: string;
  selectedPresetId?: string;
  status: QuoteStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiPage<T> extends ApiSuccess<T[]> {
  meta: PageMeta;
}

export const PROJECT_CATEGORIES = ['Landing Page', 'Sistema Web', 'API / Integração', 'Consultoria'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectProps {
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
}

export interface Project extends ProjectProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

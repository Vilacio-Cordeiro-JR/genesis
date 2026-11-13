export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  features: string[];
  demoUrl?: string;
  isPreset: boolean;
}

export interface QuotePayload {
  clientName: string;
  clientEmail: string;
  companyName?: string;
  howDidYouKnow: string;
  solutionType: string;
  projectDescription: string;
  selectedPresetId?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  error?: string;
  details?: { path?: string; message?: string }[];
}

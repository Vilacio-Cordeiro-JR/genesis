export const QUOTE_STATUSES = ['PENDING', 'CONTACTED', 'ARCHIVED'] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export interface NewQuote {
  clientName: string;
  clientEmail: string;
  companyName?: string;
  howDidYouKnow: string;
  solutionType: string;
  projectDescription: string;
  selectedPresetId?: string;
}

export interface Quote extends NewQuote {
  id: string;
  status: QuoteStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteStatusUpdate {
  status: QuoteStatus;
  notes?: string;
}

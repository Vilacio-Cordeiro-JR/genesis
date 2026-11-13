import { model, Schema, type Types } from 'mongoose';
import { QUOTE_STATUSES, type QuoteStatus } from '../domain/quote.entity';

export interface QuoteDocument {
  clientName: string;
  clientEmail: string;
  companyName?: string;
  howDidYouKnow: string;
  solutionType: string;
  projectDescription: string;
  selectedPresetId?: Types.ObjectId;
  status: QuoteStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type QuoteLean = QuoteDocument & { _id: Types.ObjectId };

const quoteSchema = new Schema<QuoteDocument>(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 120 },
    clientEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    companyName: { type: String, trim: true, maxlength: 160 },
    howDidYouKnow: { type: String, required: true, trim: true, maxlength: 200 },
    solutionType: { type: String, required: true, trim: true, maxlength: 100 },
    projectDescription: { type: String, required: true, trim: true, maxlength: 3000 },
    selectedPresetId: { type: Schema.Types.ObjectId, ref: 'Project' },
    status: { type: String, enum: [...QUOTE_STATUSES], default: 'PENDING', index: true },
    notes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true, versionKey: false },
);

quoteSchema.index({ status: 1, createdAt: -1 });

export const QuoteModel = model<QuoteDocument>('Quote', quoteSchema, 'quotes');

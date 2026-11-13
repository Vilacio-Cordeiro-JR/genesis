import { model, Schema, type Types } from 'mongoose';
import { PROJECT_CATEGORIES, type ProjectProps } from '../domain/project.entity';

export interface ProjectDocument extends ProjectProps {
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectLean = ProjectDocument & { _id: Types.ObjectId };

const projectSchema = new Schema<ProjectDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true, maxlength: 100 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, required: true, enum: [...PROJECT_CATEGORIES] },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    thumbnailUrl: { type: String, required: true, trim: true, maxlength: 500 },
    tags: { type: [String], default: [], index: true },
    features: { type: [String], default: [] },
    demoUrl: { type: String, trim: true, maxlength: 500 },
    isPreset: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

projectSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { name: 'project_text_search', weights: { title: 10, tags: 5, description: 1 }, default_language: 'portuguese' },
);
projectSchema.index({ isActive: 1, category: 1, createdAt: -1 });
projectSchema.index({ isActive: 1, isPreset: 1 });

export const ProjectModel = model<ProjectDocument>('Project', projectSchema, 'projects');

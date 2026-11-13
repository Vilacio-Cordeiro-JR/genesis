import type { Request, Response } from 'express';
import { AppError } from '../../../shared/AppError';
import { sendOk, sendPage } from '../../../shared/response';
import { idParamsSchema } from '../../../shared/validation';
import type { ProjectService } from '../application/project.service';
import {
  adminListQuerySchema,
  createProjectSchema,
  publicListQuerySchema,
  removeQuerySchema,
  slugParamsSchema,
  updateProjectSchema,
} from './project.schemas';

export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  listPublic = async (req: Request, res: Response): Promise<void> => {
    sendPage(res, await this.service.listPublic(publicListQuerySchema.parse(req.query)));
  };

  getPublicBySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = slugParamsSchema.parse(req.params);
    sendOk(res, await this.service.getPublicBySlug(slug));
  };

  listAdmin = async (req: Request, res: Response): Promise<void> => {
    sendPage(res, await this.service.listAdmin(adminListQuerySchema.parse(req.query)));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    sendOk(res, await this.service.create(createProjectSchema.parse(req.body)), 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamsSchema.parse(req.params);
    sendOk(res, await this.service.update(id, updateProjectSchema.parse(req.body)));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamsSchema.parse(req.params);
    const { hard } = removeQuerySchema.parse(req.query);
    if (hard && req.auth?.role !== 'SUPER_ADMIN') {
      throw AppError.forbidden('Exclusão definitiva exige perfil SUPER_ADMIN');
    }
    const mode = hard ? 'hard' : 'soft';
    await this.service.remove(id, mode);
    sendOk(res, { id, mode });
  };
}

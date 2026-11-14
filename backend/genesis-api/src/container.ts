import { env } from './config/env';
import { ProjectService } from './modules/projects/application/project.service';
import { PgProjectRepository } from './modules/projects/infra/project.pg-repository';
import { ProjectController } from './modules/projects/http/project.controller';
import { QuoteService } from './modules/quotes/application/quote.service';
import { PgQuoteRepository } from './modules/quotes/infra/quote.pg-repository';
import { QuoteController } from './modules/quotes/http/quote.controller';
import { AuthService } from './modules/users/application/auth.service';
import { PgUserRepository } from './modules/users/infra/user.pg-repository';
import { AuthController } from './modules/users/http/auth.controller';

const projectRepository = new PgProjectRepository();
const quoteRepository = new PgQuoteRepository();
export const userRepository = new PgUserRepository();

export const projectController = new ProjectController(new ProjectService(projectRepository));
export const quoteController = new QuoteController(new QuoteService(quoteRepository, projectRepository));
export const authController = new AuthController(new AuthService(userRepository, env.JWT_SECRET));

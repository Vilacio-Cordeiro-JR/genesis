import { env } from './config/env';
import { ProjectService } from './modules/projects/application/project.service';
import { MongoProjectRepository } from './modules/projects/infra/project.mongo-repository';
import { ProjectController } from './modules/projects/http/project.controller';
import { QuoteService } from './modules/quotes/application/quote.service';
import { MongoQuoteRepository } from './modules/quotes/infra/quote.mongo-repository';
import { QuoteController } from './modules/quotes/http/quote.controller';
import { AuthService } from './modules/users/application/auth.service';
import { MongoUserRepository } from './modules/users/infra/user.mongo-repository';
import { AuthController } from './modules/users/http/auth.controller';

const projectRepository = new MongoProjectRepository();
const quoteRepository = new MongoQuoteRepository();
export const userRepository = new MongoUserRepository();

export const projectController = new ProjectController(new ProjectService(projectRepository));
export const quoteController = new QuoteController(new QuoteService(quoteRepository, projectRepository));
export const authController = new AuthController(new AuthService(userRepository, env.JWT_SECRET));

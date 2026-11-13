import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { env, isProduction } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { generalLimiter } from './middlewares/rateLimiters';
import { apiRoutes } from './routes';

export const createApp = (): Express => {
  const app = express();

  app.disable('x-powered-by');
  if (isProduction) app.set('trust proxy', 1);

  // Esta API só responde JSON (nunca HTML/JS/CSS próprios), então a CSP mais segura
  // é negar tudo por padrão em vez de confiar nos defaults do helmet pensados para páginas.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.use(
    cors({
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : false,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      maxAge: 600,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.use(hpp());

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api/v1', generalLimiter, apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

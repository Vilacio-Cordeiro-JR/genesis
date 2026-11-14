import type { Request, Response } from 'express';
import { createApp } from '../src/app';
import { connectDatabase } from '../src/config/database';

const app = createApp();

// Reaproveitado entre invocações "quentes" da função serverless, em vez de
// testar a conexão a cada requisição. Em runtime a Vercel chama esta função
// com objetos de requisição/resposta do Node puro, que o próprio Express
// aumenta internamente — por isso tipamos como Request/Response daqui.
let dbReady: Promise<void> | null = null;

export default async function handler(req: Request, res: Response): Promise<void> {
  dbReady ??= connectDatabase();
  await dbReady;
  app(req, res);
}

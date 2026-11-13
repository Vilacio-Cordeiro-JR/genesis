import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const server = createApp().listen(env.PORT, () => {
    console.log(`Genesis API em http://localhost:${env.PORT}`);
  });

  const shutdown = (): void => {
    server.close(() => {
      disconnectDatabase().finally(() => process.exit(0));
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

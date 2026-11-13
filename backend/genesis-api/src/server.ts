import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';
import { UserModel } from './modules/users/infra/user.model';
import { hashPassword } from './modules/users/application/password';

const seedAdmin = async (): Promise<void> => {
  try {
    const existingAdmin = await UserModel.findOne({ email: 'ghenesistech@gmail.com' });
    if (!existingAdmin) {
      const hashedPassword = await hashPassword('genesis4747');
      await UserModel.create({
        name: 'Genesis',
        email: 'ghenesistech@gmail.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      });
      console.log('>>> Conta de Administrador criada automaticamente com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao semear o administrador:', error);
  }
};

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
  
  // Cria o admin assim que conecta ao banco
  await seedAdmin();

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
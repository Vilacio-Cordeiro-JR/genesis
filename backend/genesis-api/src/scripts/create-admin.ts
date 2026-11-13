import { connectDatabase, disconnectDatabase } from '../config/database';
import { userRepository } from '../container';
import { hashPassword } from '../modules/users/application/password';

const run = async (): Promise<void> => {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password || password.length < 10) {
    throw new Error('Uso: npm run create-admin -- "Nome" email@dominio.com senha-com-10+-caracteres');
  }

  await connectDatabase();
  const user = await userRepository.create({
    name,
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    role: 'SUPER_ADMIN',
  });
  console.log(`SUPER_ADMIN criado: ${user.email}`);
};

run()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => disconnectDatabase());

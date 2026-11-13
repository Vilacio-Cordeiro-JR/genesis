import mongoose from 'mongoose';
import { env } from './env';

const describeUri = (uri: string): string => {
  const match = /^(mongodb(?:\+srv)?:\/\/)([^:@/]*):([^@]*)@(.*)$/.exec(uri);
  if (!match) return `formato inesperado (começa com: ${JSON.stringify(uri.slice(0, 20))})`;
  const [, scheme, user, password, rest] = match;
  return `${scheme}${JSON.stringify(user)}:<senha com ${password?.length} caracteres>@${rest}`;
};

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  } catch (error) {
    console.error('Falha ao conectar. URI vista pela API:', describeUri(env.MONGODB_URI));
    throw error;
  }
};

export const disconnectDatabase = (): Promise<void> => mongoose.disconnect();

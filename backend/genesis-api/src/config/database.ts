import { Pool } from 'pg';
import { env, isProduction } from './env';

// Neon (e a maioria dos provedores de Postgres gerenciado) exige TLS; a string
// de conexão normalmente já traz `sslmode=require`, mas fixamos aqui também
// para funcionar mesmo se essa query string for omitida em produção.
const useSsl = isProduction || /sslmode=require|neon\.tech/.test(env.DATABASE_URL);

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (error) => {
  console.error('Erro inesperado no pool do PostgreSQL:', error);
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    console.error('Falha ao conectar ao PostgreSQL. Verifique a variável DATABASE_URL.');
    throw error;
  }
};

export const disconnectDatabase = (): Promise<void> => pool.end();

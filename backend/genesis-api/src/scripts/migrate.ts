import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { disconnectDatabase, pool } from '../config/database';

const run = async (): Promise<void> => {
  const sql = readFileSync(join(__dirname, '../../sql/schema.sql'), 'utf-8');
  await pool.query(sql);
  console.log('Schema do PostgreSQL aplicado com sucesso.');
};

run()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => disconnectDatabase());

import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read and execute the SQL file
    const sql = readFileSync(resolve(__dirname, 'update-services.sql'), 'utf8');
    await client.query(sql);
    console.log('Database updated successfully');
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main(); 
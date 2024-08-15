import pg from 'pg';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

dotenv.config();

const { DB_URL } = process.env;

const client = new pg.Client({
	connectionString: DB_URL
});

client.connect();

export const db = drizzle(client, { schema });

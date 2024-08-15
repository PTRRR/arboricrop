import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as dotenv from 'dotenv';

dotenv.config();

const { DB_URL } = process.env;

const pool = new pg.Pool({
	connectionString: DB_URL
});

const db = drizzle(pool);

const main = async () => {
	console.log('migrating...');
	await migrate(db, { migrationsFolder: 'drizzle' });
	console.log('ok');
	process.exit(0);
};

main().catch((error) => {
	console.log(error);
	process.exit(0);
});

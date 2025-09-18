import { drizzle } from 'drizzle-orm/neon-http';
import * as auth from './schema/auth';
import * as tables from './schema/tables';

export const db = drizzle(process.env.DATABASE_URL!, {
	casing: 'snake_case',
});

export const schema = {
	...auth,
	...tables,
};

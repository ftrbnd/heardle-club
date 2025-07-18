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

export * from './schema.types';
export * from './schema.zod';

export function generateSecureRandomString(): string {
	const alphabet = 'abcdefghijklmnpqrstuvwxyz23456789';

	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = '';
	for (let i = 0; i < bytes.length; i++) {
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

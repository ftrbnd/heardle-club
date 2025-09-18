import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: ['./src/postgres/schema/auth.ts', './src/postgres/schema/tables.ts'],
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	casing: 'snake_case',
});

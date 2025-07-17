import { SelectUser, selectUserSchema } from '@repo/database/postgres';

export const AUTH_URL =
	process.env.NODE_ENV === 'production'
		? 'https://heardle.club/auth'
		: 'http://[::1]:3001/auth';

export const userSchema = selectUserSchema
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.nullable();
export type User = Omit<SelectUser, 'createdAt' | 'updatedAt'>;

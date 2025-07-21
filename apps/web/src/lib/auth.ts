import { SelectUser, selectUserSchema } from '@repo/database/postgres';

const NGROK_URL = process.env.NGROK_URL;

export const AUTH_URL =
	process.env.NODE_ENV === 'production'
		? 'https://heardle.club/auth'
		: `${NGROK_URL}/auth`;

export const userSchema = selectUserSchema
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.nullable();
export type User = Omit<SelectUser, 'createdAt' | 'updatedAt'>;

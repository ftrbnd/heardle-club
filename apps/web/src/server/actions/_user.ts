import { SelectUser, selectUserSchema } from '@repo/database/postgres';

export const userSchema = selectUserSchema
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.nullable();
export type User = Omit<SelectUser, 'createdAt' | 'updatedAt'>;

import { eq } from 'drizzle-orm';
import { db, InsertUser, InsertOAuthAccount } from '../postgres';
import { users, oauthAccounts } from '../postgres/schema/auth';

export const getUserByEmail = async (email: string) => {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	return result.length > 0 ? result[0] : null;
};

export const getUserById = async (userId?: string) => {
	if (!userId) return null;

	const result = await db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return result.length > 0 ? result[0] : null;
};

export const insertUser = async (
	newUser: InsertUser,
	newAccount: InsertOAuthAccount
) => {
	const userResult = await db.insert(users).values(newUser).returning();
	const accountResult = await db
		.insert(oauthAccounts)
		.values(newAccount)
		.returning();

	return {
		user: userResult[0],
		account: accountResult[0],
	};
};

type UpdateUserValues = Omit<InsertUser, 'id' | 'email'>;
export const updateUser = async (userId: string, values: UpdateUserValues) => {
	await db.update(users).set(values).where(eq(users.id, userId)).returning();
};

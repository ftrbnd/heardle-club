import { eq, and, sql } from 'drizzle-orm';
import { InsertSession, db, InsertOAuthAccount } from '../postgres';
import { sessions, oauthAccounts } from '../postgres/schema/auth';

export const insertSession = async (newSession: InsertSession) => {
	const result = await db.insert(sessions).values(newSession).returning();

	return result[0];
};

export const selectSession = async (sessionId: string) => {
	const result = await db
		.select()
		.from(sessions)
		.where(eq(sessions.id, sessionId))
		.limit(1);

	return result.length > 0 ? result[0] : null;
};

export const deleteSession = async (sessionId: string) => {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
};

export const addOAuthAccount = async (newAccount: InsertOAuthAccount) => {
	const accountExists = await db
		.select()
		.from(oauthAccounts)
		.where(
			and(
				eq(oauthAccounts.provider, newAccount.provider),
				eq(oauthAccounts.userId, newAccount.userId)
			)
		);
	if (accountExists.length > 0) return accountExists[0];

	const result = await db.insert(oauthAccounts).values(newAccount).returning();

	return result.length > 0 ? result[0] : null;
};

export const updateSession = async (
	sessionId: string,
	lastVerifiedAt: Date
) => {
	await db
		.update(sessions)
		.set({
			lastVerifiedAt,
			updatedAt: sql`now() AT TIME ZONE 'utc'`,
		})
		.where(eq(sessions.id, sessionId));
};

import { and, eq } from 'drizzle-orm';
import { db } from '..';
import {
	InsertUser,
	InsertOAuthAccount,
	SelectStatistics,
} from '../schema/types';
import { users, oauthAccounts } from '../schema/auth';
import { statistics } from '../schema';
import { generateSecureRandomString } from '../../common';

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

export const getUserStatistics = async (userId: string, clubId: string) => {
	const result = await db
		.select()
		.from(statistics)
		.where(and(eq(statistics.userId, userId), eq(statistics.clubId, clubId)));

	return result.length > 0 ? result[0] : null;
};

export const insertUserStatistics = async (userId: string, clubId: string) => {
	const [result] = await db
		.insert(statistics)
		.values({
			id: generateSecureRandomString(),
			userId,
			clubId,
			accuracy: 0,
			gamesPlayed: 0,
			gamesWon: 0,
			currentStreak: 0,
			maxStreak: 0,
		})
		.returning();

	return result;
};

export type BareStatistics = Pick<
	SelectStatistics,
	'accuracy' | 'currentStreak' | 'gamesPlayed' | 'gamesWon' | 'maxStreak'
>;
export const updateUserStatistics = async (
	userId: string,
	clubId: string,
	values: Partial<BareStatistics>
) => {
	const [newStatistics] = await db
		.update(statistics)
		.set(values)
		.where(and(eq(statistics.userId, userId), eq(statistics.clubId, clubId)))
		.returning();

	return newStatistics;
};

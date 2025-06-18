import { and, eq, sql } from 'drizzle-orm';
import { db, InsertOAuthAccount, InsertSession, InsertUser } from '../postgres';
import { oauthAccounts, sessions, users } from '../postgres/schema/auth';
import { baseSongs, clubs, usersToClubs } from '../postgres/schema/tables';
import { redis } from '../redis';
import {
	customSongSchema,
	dailySongSchema,
	heardleSongSchema,
} from '../redis/schema';

export const getClubs = async () => {
	const allClubs = await db.select().from(clubs);

	return allClubs;
};

export const getSongs = async () => {
	const songs = await db.select().from(baseSongs);

	return songs;
};

export const getDailySong = async () => {
	const response = await redis.get('daily_song');
	const dailySong = dailySongSchema.parse(response);

	return dailySong;
};

export const getCustomSong = async (id: string) => {
	const response = await redis.get(`custom_song:${id}`);
	const customSong = customSongSchema.parse(response);

	return customSong;
};

type CreateCustomSongParams = {
	songId: string;
	userId: string;
	startTime: number;
};
export const createCustomSong = async (params: CreateCustomSongParams) => {
	// TODO: send request to backend server
};

type DeleteCustomSongParams = {
	customSongId: string;
	userId: string;
};
export const deleteCustomSong = async (params: DeleteCustomSongParams) => {
	// TODO: send request to backend server
};

export const getUnlimitedSongs = async (clubId: string) => {
	const response = await redis.mget(`unlimited_songs:${clubId}:*`);
	const unlimitedSongs = heardleSongSchema.array().parse(response);

	return unlimitedSongs;
};

export const getUsersFromClub = async (clubId: string) => {
	const clubUsers = await db
		.select()
		.from(usersToClubs)
		.leftJoin(users, eq(usersToClubs.userId, users.id))
		.where(eq(usersToClubs.clubId, clubId));

	return clubUsers;
};

export const insertSession = async (newSession: InsertSession) => {
	const result = await db.insert(sessions).values(newSession).returning();

	return result[0];
};

export const selectSession = async (sessionId: string) => {
	const session = await db
		.select()
		.from(sessions)
		.where(eq(sessions.id, sessionId))
		.limit(1);

	return session[0];
};

export const deleteSession = async (sessionId: string) => {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
};

export const getUserByEmail = async (email: string) => {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	return result.length > 0 ? result[0] : null;
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

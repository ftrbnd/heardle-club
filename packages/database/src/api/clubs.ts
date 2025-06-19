import { eq } from 'drizzle-orm';
import { db } from '../postgres';
import { InsertClub } from '../postgres/schema.types';
import { users } from '../postgres/schema/auth';
import { clubs, usersToClubs } from '../postgres/schema/tables';

export const insertClub = async (newClub: InsertClub) => {
	const result = await db.insert(clubs).values(newClub).returning();

	return result[0];
};

export const getClubs = async () => {
	const allClubs = await db.select().from(clubs);

	return allClubs;
};

export const getUsersFromClub = async (clubId: string) => {
	const clubUsers = await db
		.select()
		.from(usersToClubs)
		.leftJoin(users, eq(usersToClubs.userId, users.id))
		.where(eq(usersToClubs.clubId, clubId));

	return clubUsers;
};

export const getTrendingClubs = async () => {
	const result = await db.select().from(clubs).limit(10);
	result.sort(
		(a, b) =>
			(b.updatedAt ?? b.createdAt).getTime() -
			(a.updatedAt ?? a.createdAt).getTime()
	);

	return result;
};

export const getJoinedClubs = async (userId?: string) => {
	if (!userId) return [];

	const result = await db
		.select()
		.from(usersToClubs)
		.leftJoin(clubs, eq(usersToClubs.clubId, clubs.id))
		.where(eq(usersToClubs.userId, userId));

	return result;
};

import { eq, sql } from 'drizzle-orm';
import { db } from '../postgres';
import { InsertClub } from '../postgres/schema.types';
import { users } from '../postgres/schema/auth';
import { clubs, usersToClubs } from '../postgres/schema/tables';

export const insertClub = async (newClub: InsertClub) => {
	const result = await db.insert(clubs).values(newClub).returning();

	return result[0];
};

export const searchClubs = async (query: string) => {
	const result = await db.select().from(clubs).where(sql`(
			setweight(to_tsvector('english', ${clubs.displayName}), 'A') ||
			setweight(to_tsvector('english', ${clubs.subdomain}), 'B'))
			@@ to_tsquery('english', ${query}
		  )`);

	return result;
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

export const getClubByArtistId = async (artistId: string) => {
	const result = await db
		.select()
		.from(clubs)
		.where(eq(clubs.artistId, artistId))
		.limit(1);

	return result.length > 0 ? result[0] : null;
};

export const getClubBySubdomain = async (subdomain: string) => {
	const result = await db
		.select()
		.from(clubs)
		.where(eq(clubs.subdomain, subdomain))
		.limit(1);

	return result.length > 0 ? result[0] : null;
};

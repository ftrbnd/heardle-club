import { and, eq, sql } from 'drizzle-orm';
import { db } from '../postgres';
import { InsertClub } from '../postgres/schema.types';
import { users } from '../postgres/schema/auth';
import { clubs, usersToClubs } from '../postgres/schema/tables';

export const insertClub = async (newClub: InsertClub) => {
	const [club] = await db.insert(clubs).values(newClub).returning();
	await db.insert(usersToClubs).values({
		clubId: club.id,
		userId: club.ownerId,
	});

	return club;
};

export const searchClubs = async (query: string) => {
	const result = await db.select().from(clubs).where(sql`(
			setweight(to_tsvector('english', ${clubs.displayName}), 'A') ||
			setweight(to_tsvector('english', ${clubs.subdomain}), 'B'))
			@@ phraseto_tsquery('english', ${query}
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

export const addUserToClub = async (userId: string, clubId: string) => {
	const result = await db
		.insert(usersToClubs)
		.values({
			clubId,
			userId,
		})
		.returning();

	return result[0];
};

export const removeUserFromClub = async (userId: string, clubId: string) => {
	const userOwnedClubs = await db
		.select()
		.from(clubs)
		.where(and(eq(clubs.id, clubId), eq(clubs.ownerId, userId)));
	if (userOwnedClubs.length > 0)
		throw new Error(
			'You cannot leave a club you own. Delete the club instead.'
		);

	await db
		.delete(usersToClubs)
		.where(
			and(eq(usersToClubs.userId, userId), eq(usersToClubs.clubId, clubId))
		);
};

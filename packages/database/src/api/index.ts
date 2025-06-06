import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema/auth.js';
import { baseSongs, clubs, usersToClubs } from '../db/schema/tables.js';
import { redis } from '../redis/index.js';
import {
	customSongSchema,
	dailySongSchema,
	heardleSongSchema,
} from '../redis/schema.js';

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

export const getCustomSong = async (id: number) => {
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

export const getUnlimitedSongs = async (clubId: number) => {
	const response = await redis.mget(`unlimited_songs:${clubId}:*`);
	const unlimitedSongs = heardleSongSchema.array().parse(response);

	return unlimitedSongs;
};

export const getUsersFromClub = async (clubId: number) => {
	const clubUsers = await db
		.select()
		.from(usersToClubs)
		.leftJoin(users, eq(usersToClubs.userId, users.id))
		.where(eq(usersToClubs.clubId, clubId));

	return clubUsers;
};

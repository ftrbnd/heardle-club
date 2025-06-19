import { db } from '../postgres';
import { baseSongs } from '../postgres/schema/tables';
import {
	redis,
	dailySongSchema,
	customSongSchema,
	heardleSongSchema,
} from '../redis';

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

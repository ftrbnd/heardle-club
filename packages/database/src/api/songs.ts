import { z } from 'zod';
import { db, InsertBaseSong } from '../postgres';
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

const clubDownloadStatusKey = (clubId: string) =>
	`download_status:${clubId}` as const;

export const setDownloadStatus = async (
	clubId: string,
	curAmt: number,
	totalAmt: number
) => {
	await redis.set(clubDownloadStatusKey(clubId), `${curAmt}/${totalAmt}`);
};

export const clearDownloadStatus = async (clubId: string) => {
	await redis.del(clubDownloadStatusKey(clubId));
};

export const getDownloadStatus = async (clubId: string) => {
	const response = await redis.get(clubDownloadStatusKey(clubId));
	const status = z.string().optional().nullable().parse(response);

	return status;
};

export const insertClubSong = async (newSong: InsertBaseSong) => {
	const response = await db.insert(baseSongs).values(newSong).returning();
	return response.length > 0 ? response[0] : null;
};

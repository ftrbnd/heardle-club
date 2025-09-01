import { z } from 'zod/v4';
import {
	db,
	InsertBaseSong,
	SelectBaseSong,
	selectBaseSongSchema,
} from '../postgres';
import { baseSongs } from '../postgres/schema/tables';
import { redis } from '../redis';
import { eq, sql } from 'drizzle-orm';

export const getClubSongs = async (clubId?: string) => {
	if (!clubId) return [];

	const songs = await db
		.select()
		.from(baseSongs)
		.where(eq(baseSongs.clubId, clubId));

	return songs;
};

export const getRandomSong = async (clubId: string) => {
	const result = await db
		.select()
		.from(baseSongs)
		.where(eq(baseSongs.clubId, clubId))
		.orderBy(sql`random()`)
		.limit(1);

	return result.length > 0 ? result[0] : null;
};

export const setClubDailySong = async (
	clubId: string,
	song: SelectBaseSong,
	url: string
) => {
	await redis.json.set(`daily:${clubId}`, '$', {
		song,
		url,
	});
	console.log('Uploaded daily song data to Redis');
};

export const getClubDailySong = async (clubId: string) => {
	const data = await redis.json.get(`daily:${clubId}`);
	const daily = z
		.object({
			song: selectBaseSongSchema.omit({
				updatedAt: true,
				createdAt: true,
			}),
			url: z.string(),
		})
		.nullable()
		.parse(data);

	return daily;
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

export const deleteClubSong = async (songId: string) => {
	await db.delete(baseSongs).where(eq(baseSongs.id, songId));
};

type UpdateClubSongAudio = Pick<InsertBaseSong, 'id' | 'audio' | 'duration'>;
export const updateClubSongAudio = async (values: UpdateClubSongAudio) => {
	await db
		.update(baseSongs)
		.set({ ...values, source: 'file_upload' })
		.where(eq(baseSongs.id, values.id));
};

export const updateClubSongDuration = async (
	songId: string,
	duration: number
) => {
	await db
		.update(baseSongs)
		.set({
			duration,
		})
		.where(eq(baseSongs.id, songId));
};

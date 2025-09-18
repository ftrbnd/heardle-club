import z from 'zod/v4';
import { redis } from '..';
import {
	SelectBaseSong,
	selectBaseSongSchema,
} from '../../postgres/schema/types';
import { downloadStatusSchema } from '../schema';

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

export const clubDownloadStatusKey = (clubId: string) =>
	`download_status:${clubId}` as const;

export const setDownloadStatus = async (
	clubId: string,
	curAmt: number,
	totalAmt: number
) => {
	await redis.json.set(clubDownloadStatusKey(clubId), '$', {
		current: curAmt,
		total: totalAmt,
	});
};

export const clearDownloadStatus = async (clubId: string) => {
	await redis.json.del(clubDownloadStatusKey(clubId));
};

export const getDownloadStatus = async (clubId: string) => {
	const response = await redis.json.get(clubDownloadStatusKey(clubId));
	const status = downloadStatusSchema.parse(response);

	return status;
};

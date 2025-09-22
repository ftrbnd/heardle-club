import z from 'zod/v4';
import { redis } from '..';
import {
	SelectBaseSong,
	selectBaseSongSchema,
} from '../../postgres/schema/types';

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

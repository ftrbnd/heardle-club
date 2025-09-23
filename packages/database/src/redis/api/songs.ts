import z from 'zod/v4';
import { redis } from '..';
import {
	SelectBaseSong,
	selectBaseSongSchema,
} from '../../postgres/schema/types';

const dailySongKey = (clubId: string) => `daily:${clubId}` as const;

export const setClubDailySong = async (
	clubId: string,
	song: SelectBaseSong,
	url: string
) => {
	await redis.json.set(dailySongKey(clubId), '$', {
		song,
		url,
	});
	console.log('Uploaded daily song data to Redis');
};

export const getClubDailySong = async (clubId: string) => {
	const data = await redis.json.get(dailySongKey(clubId));
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

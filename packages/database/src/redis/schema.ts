import { z } from 'zod/v4';

export const heardleSongSchema = z.object({
	songId: z.string(),
	startTime: z.number(),
	audio: z.string(),
});

export const dailySongSchema = z.object({
	...heardleSongSchema.shape,
	firstUser: z
		.object({
			id: z.string(),
			streak: z.number(),
		})
		.optional(),
});

export const customSongSchema = z.object({
	...heardleSongSchema.shape,
	userId: z.string(),
});

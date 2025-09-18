import z from 'zod/v4';

export const heardleSongSchema = z.object({
	songId: z.string(),
	startTime: z.number(),
	audio: z.string(),
});
export type HeardleSong = z.infer<typeof heardleSongSchema>;

export const dailySongSchema = z.object({
	...heardleSongSchema.shape,
	firstUser: z
		.object({
			id: z.string(),
			streak: z.number(),
		})
		.optional(),
});
export type DailySong = z.infer<typeof dailySongSchema>;

export const customSongSchema = z.object({
	...heardleSongSchema.shape,
	userId: z.string(),
});
export type CustomSong = z.infer<typeof customSongSchema>;

export const defaultDownloadStatus = {
	current: 0,
	total: 0,
	done: false,
} as const;

export const downloadStatusSchema = z
	.object({
		current: z.number(),
		total: z.number(),
		done: z.boolean().optional(),
	})
	.nullable()
	.default(defaultDownloadStatus);

export type DownloadStatus = z.infer<typeof downloadStatusSchema>;

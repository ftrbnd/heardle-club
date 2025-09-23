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

export const downloadJobProgressSchema = z
	.object({
		currentTrack: z.string().nullable(),
		currentStep: z.number(),
		totalTracks: z.number(),
		percentage: z.number(),
	})
	.default({
		currentTrack: null,
		currentStep: 0,
		totalTracks: 0,
		percentage: 0,
	});

export type DownloadJobProgress = z.infer<typeof downloadJobProgressSchema>;

export const dailyJobProgressSchema = z
	.object({
		message: z.string(),
		percentage: z.number(),
	})
	.default({ message: '', percentage: 0 });

export type DailyJobProgress = z.infer<typeof dailyJobProgressSchema>;

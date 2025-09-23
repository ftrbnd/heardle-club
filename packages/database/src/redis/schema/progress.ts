import z from 'zod/v4';

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

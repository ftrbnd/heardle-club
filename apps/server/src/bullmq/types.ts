import { ClubModel } from '@/elysia/modules/clubs/model';
import { z } from 'zod/v4';

export type JobDataType = ClubModel.DownloadClubSongsBody;

export const defaultDownloadJobProgress = {
	currentTrack: null,
	currentStep: 0,
	totalTracks: 0,
	percentage: 0,
} as const;

export const downloadJobProgressSchema = z
	.object({
		currentTrack: z.string().nullable(),
		currentStep: z.number(),
		totalTracks: z.number(),
		percentage: z.number(),
	})
	.default(defaultDownloadJobProgress);

export type DownloadJobProgress = z.infer<typeof downloadJobProgressSchema>;

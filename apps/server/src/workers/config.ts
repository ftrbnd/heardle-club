import { ClubModel } from '@/server/modules/clubs/model';
import { ConnectionOptions } from 'bullmq';
import path from 'path';
import { z } from 'zod/v4';

const host = process.env.UPSTASH_REDIS_REST_URL!.replace('https://', '');

export const connection: ConnectionOptions = {
	host,
	port: 6379,
	password: process.env.UPSTASH_REDIS_REST_TOKEN,
	tls: {},
};

export const DOWNLOAD_QUEUE_NAME = 'audio_download' as const;
export const DAILY_QUEUE_NAME = 'daily_song' as const;

export const downloadProcessorFile = path.join(__dirname, 'download.worker.ts');
export const dailyProcessorFile = path.join(__dirname, 'daily.worker.ts');

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

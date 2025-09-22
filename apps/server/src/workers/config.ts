import { ClubModel } from '@/server/modules/clubs/model';
import { ConnectionOptions } from 'bullmq';
import path from 'path';

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

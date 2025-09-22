import { ConnectionOptions } from 'bullmq';
import path from 'path';

const host = process.env.UPSTASH_REDIS_REST_URL!.replace('https://', '');

export const connection: ConnectionOptions = {
	host,
	port: 6379,
	password: process.env.UPSTASH_REDIS_REST_TOKEN,
	tls: {},
};

export const QUEUE_NAME = 'audio_download' as const;

export const processorFile = path.join(__dirname, 'worker.ts');

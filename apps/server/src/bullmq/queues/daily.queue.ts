import { connection } from '@/bullmq/config';
import { Queue } from 'bullmq';

export const DAILY_QUEUE_NAME = 'daily_song' as const;

export const dailyQueue = new Queue(DAILY_QUEUE_NAME, {
	connection,
});

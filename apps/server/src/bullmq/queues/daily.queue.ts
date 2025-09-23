import { connection } from '@/bullmq/config';
import { DailyJobProgress } from '@repo/database/redis/schema';
import { Queue } from 'bullmq';

export const DAILY_QUEUE_NAME = 'daily_song' as const;

export const dailyQueue = new Queue(DAILY_QUEUE_NAME, {
	connection,
});

export async function getDailyJobProgress(clubId: string) {
	const jobs = await dailyQueue.getJobs();
	const job = jobs.find((job) =>
		job ? job.data.clubId === clubId && job.isActive() : null
	);

	return job ? (job.progress as DailyJobProgress) : null;
}

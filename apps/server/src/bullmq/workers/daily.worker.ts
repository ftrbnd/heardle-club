import { connection } from '@/bullmq/config';
import { dailyQueue } from '@/bullmq/queues/daily.queue';
import { DAILY_QUEUE_NAME } from '@/bullmq/queues/daily.queue';
import { Worker } from 'bullmq';
import path from 'path';

export async function createScheduledWorker() {
	const dailyProcessorFile = path.join(__dirname, '../jobs/daily.job.ts');

	await dailyQueue.upsertJobScheduler(
		'daily-song-scheduler',
		{
			pattern: '* * * * *', // every minute
			// pattern: '0 4 * * *' // midnight UTC
			utc: true,
		},
		{
			name: 'set-daily-songs',
		}
	);

	const worker = new Worker(DAILY_QUEUE_NAME, dailyProcessorFile, {
		connection,
	});

	return worker;
}

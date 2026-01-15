import { connection } from '@/bullmq/config';
import { dailyQueue } from '@/bullmq/queues/daily.queue';
import { DAILY_QUEUE_NAME } from '@/bullmq/queues/daily.queue';
import { getAllActiveClubs } from '@repo/database/postgres/api';
import { Worker } from 'bullmq';
import path from 'path';
import { pathToFileURL } from 'url';

export async function createScheduledWorker() {
	const dailyProcessorFile =
		process.env.DEV_OS === 'windows'
			? pathToFileURL(__dirname + '/../jobs/daily.job.ts')
			: path.join(__dirname, '../jobs/daily.job.ts');

	const clubs = await getAllActiveClubs();

	for (const club of clubs) {
		await dailyQueue.upsertJobScheduler(
			`club_${club.id}_scheduler`,
			{
				pattern: '*/5 * * * *', // every minute
				// pattern: '0 4 * * *', // midnight UTC
				utc: true,
				immediately: true,
			},
			{
				name: 'set-daily-songs',
				data: {
					clubId: club.id,
				},
			}
		);
	}

	const worker = new Worker(DAILY_QUEUE_NAME, dailyProcessorFile, {
		connection,
	});

	return worker;
}

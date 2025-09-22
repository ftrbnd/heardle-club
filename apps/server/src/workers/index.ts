import 'dotenv/config';

import { Worker } from 'bullmq';
import {
	connection,
	JobDataType,
	DOWNLOAD_QUEUE_NAME,
	DAILY_QUEUE_NAME,
	downloadProcessorFile,
	dailyProcessorFile,
} from '@/workers/config';
import { dailyQueue } from '@/workers/queue';

function createDownloadWorker() {
	const worker = new Worker<JobDataType>(
		DOWNLOAD_QUEUE_NAME,
		downloadProcessorFile,
		{
			connection,
		}
	);
	attachListeners(worker, 'download');

	return worker;
}

async function createScheduledWorker() {
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
	attachListeners(worker, 'daily');

	return worker;
}

function attachListeners<T>(
	worker: Worker<T>,
	progressType: 'download' | 'daily'
) {
	worker.on('ready', () => console.log(`"${worker.name}" worker ready`));
	worker.on('progress', (job, progress) => {
		// TODO: separate download and daily job progress schemas
		console.log(`Job ${job.id} progress: ${progress}%...`);
	});
	worker.on('failed', (job, error: Error) => {
		console.error(`Job ${job?.id} failed:`, error);
	});
	worker.on('error', (err) => console.error(err));
	worker.on('completed', (job) => {
		console.log(`Job ${job.id} complete!`);
	});
}

createDownloadWorker();
createScheduledWorker();

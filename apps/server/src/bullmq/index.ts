import 'dotenv/config';

import { Worker } from 'bullmq';
import { createDownloadWorker } from '@/bullmq/workers/download.worker';
import { createScheduledWorker } from '@/bullmq/workers/daily.worker';

function attachListeners(worker: Worker, progressType: 'download' | 'daily') {
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

async function main() {
	const d = createDownloadWorker();
	attachListeners(d, 'download');

	const s = await createScheduledWorker();
	attachListeners(s, 'daily');
}

main();

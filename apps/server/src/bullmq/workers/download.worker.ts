import { connection } from '@/bullmq/config';
import { DOWNLOAD_QUEUE_NAME } from '@/bullmq/queues/download.queue';
import { DownloadJobDataType } from '@/bullmq/types';
import { Worker } from 'bullmq';
import path from 'path';
import { pathToFileURL } from 'url';

export function createDownloadWorker() {
	const downloadProcessorFile =
		process.env.DEV_OS === 'windows'
			? pathToFileURL(__dirname + '/../jobs/download.job.ts')
			: path.join(__dirname, '../jobs/download.job.ts');

	const worker = new Worker<DownloadJobDataType>(
		DOWNLOAD_QUEUE_NAME,
		downloadProcessorFile,
		{
			connection,
		}
	);

	return worker;
}

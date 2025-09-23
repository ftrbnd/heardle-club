import { connection } from '@/bullmq/config';
import { DOWNLOAD_QUEUE_NAME } from '@/bullmq/queues/download.queue';
import { DownloadJobDataType } from '@/bullmq/types';
import { Worker } from 'bullmq';
import path from 'path';

export function createDownloadWorker() {
	const downloadProcessorFile = path.join(__dirname, '../jobs/download.job.ts');

	const worker = new Worker<DownloadJobDataType>(
		DOWNLOAD_QUEUE_NAME,
		downloadProcessorFile,
		{
			connection,
		}
	);

	return worker;
}

import {
	connection,
	JobDataType,
	DOWNLOAD_QUEUE_NAME,
	DAILY_QUEUE_NAME,
} from '@/workers/config';
import { JobsOptions, Queue } from 'bullmq';

const downloadQueue = new Queue<JobDataType>(DOWNLOAD_QUEUE_NAME, {
	connection,
});

export async function addDownloadJob(data: JobDataType, opts?: JobsOptions) {
	const job = await downloadQueue.add(`club_${data.clubId}`, data, opts);
	return job;
}

export const dailyQueue = new Queue(DAILY_QUEUE_NAME, {
	connection,
});

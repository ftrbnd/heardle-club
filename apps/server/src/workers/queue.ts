import {
	connection,
	JobDataType,
	DOWNLOAD_QUEUE_NAME,
	DAILY_QUEUE_NAME,
	DownloadJobProgress,
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

export async function getDownloadJobProgress(clubId: string) {
	const jobs = await downloadQueue.getJobs();
	const job = jobs.find((job) => job.data.clubId === clubId && job.isActive());
	if (!job) throw new Error('Job not found');

	return job.progress as DownloadJobProgress;
}

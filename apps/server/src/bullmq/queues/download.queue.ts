import { connection } from '@/bullmq/config';
import { DownloadJobDataType } from '@/bullmq/types';
import { DownloadJobProgress } from '@repo/database/redis/schema';
import { JobsOptions, Queue } from 'bullmq';

export const DOWNLOAD_QUEUE_NAME = 'audio_download' as const;

const downloadQueue = new Queue<DownloadJobDataType>(DOWNLOAD_QUEUE_NAME, {
	connection,
});

export async function addDownloadJob(
	data: DownloadJobDataType,
	opts?: JobsOptions
) {
	const job = await downloadQueue.add(`club_${data.clubId}`, data, opts);
	return job;
}

export async function getDownloadJobProgress(clubId: string) {
	const jobs = await downloadQueue.getJobs();
	const job = jobs.find((job) => job.data.clubId === clubId && job.isActive());

	return job ? (job.progress as DownloadJobProgress) : null;
}

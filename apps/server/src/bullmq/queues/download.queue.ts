import { connection } from '@/bullmq/config';
import { DownloadJobProgress, JobDataType } from '@/bullmq/types';
import { JobsOptions, Queue } from 'bullmq';

export const DOWNLOAD_QUEUE_NAME = 'audio_download' as const;

const downloadQueue = new Queue<JobDataType>(DOWNLOAD_QUEUE_NAME, {
	connection,
});

export async function addDownloadJob(data: JobDataType, opts?: JobsOptions) {
	const job = await downloadQueue.add(`club_${data.clubId}`, data, opts);
	return job;
}

export async function getDownloadJobProgress(clubId: string) {
	const jobs = await downloadQueue.getJobs();
	const job = jobs.find((job) => job.data.clubId === clubId && job.isActive());
	if (!job) throw new Error('Job not found');

	return job.progress as DownloadJobProgress;
}

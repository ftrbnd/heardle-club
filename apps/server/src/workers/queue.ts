import { connection, QUEUE_NAME } from '@/workers/config';
import { JobsOptions, Queue } from 'bullmq';

const myQueue = new Queue(QUEUE_NAME, { connection });

export async function addJobs(name: string, data: any, opts?: JobsOptions) {
	await myQueue.add(name, data, opts);
}

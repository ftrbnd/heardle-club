import { SandboxedJob } from 'bullmq';

export default async (job: SandboxedJob) => {
	// TODO: run download functions here
	console.log(`Processing job ${job.id}...`, { data: job.data });
};

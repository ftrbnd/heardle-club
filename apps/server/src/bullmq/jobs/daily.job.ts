import { setDailySong } from '@/bullmq/processors/daily';
import { getAllActiveClubs } from '@repo/database/postgres/api';
import { SandboxedJob } from 'bullmq';

export default async (job: SandboxedJob) => {
	console.log(`Processing job ${job.id}...`, { data: job.data });

	const clubs = await getAllActiveClubs();

	const updateProgress = job.updateProgress.bind(job);

	for (const club of clubs) {
		try {
			await setDailySong(club.id, updateProgress);
		} catch (error) {
			if (error instanceof Error)
				if (error.message === 'Club has no songs')
					console.log(`${club.displayName} has no songs yet`);
				else console.log('Failed to set daily song:', error);
			continue;
		}
	}
};

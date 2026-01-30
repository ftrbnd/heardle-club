import { setDailySong } from '@/bullmq/processors/daily';
import { getClubById } from '@repo/database/postgres/api';
import { SandboxedJob } from 'bullmq';

export default async (job: SandboxedJob) => {
	console.log(`Processing job ${job.id}...`, { data: job.data });

	const clubId = job.data.clubId;
	const club = await getClubById(clubId);
	if (!club) throw new Error(`Club ${clubId} not found`);

	if (!club.isActive) {
		throw new Error('Club is inactive.');
		// TODO: figure out how to cancel jobs in sandboxed processes
	}

	const updateProgress = job.updateProgress.bind(job);

	try {
		await setDailySong(clubId, club.heardleDay + 1, updateProgress);
	} catch (error) {
		let emptyClub = false;

		if (error instanceof Error)
			if (error.message === 'Club has no songs') {
				console.log(`${club?.displayName} has no songs yet`);
				emptyClub = true;
			} else console.log('Failed to set daily song:', error);

		job.updateProgress({
			message: `Failed to set daily song${' (club has no songs yet)'}`,
			percentage: 0,
		});
	}
};

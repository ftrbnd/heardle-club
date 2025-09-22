import { JobDataType } from '@/workers/config';
import {
	downloadMultipleTracks,
	filterTracks,
} from '@/workers/jobs/track.download';
import { SandboxedJob } from 'bullmq';

export default async (job: SandboxedJob<JobDataType>) => {
	console.log(`Processing job ${job.id}...`, { data: job.data });
	const { clubId, artistId, trackIds } = job.data;

	const tracks = await filterTracks(artistId, trackIds);
	const count = await downloadMultipleTracks(
		tracks,
		clubId,
		job.updateProgress
	);

	console.log(`Successfully downloaded ${count}/${tracks.length} tracks`);
};

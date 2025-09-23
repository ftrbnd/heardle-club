import {
	downloadMultipleTracks,
	filterTracks,
} from '@/bullmq/processors/tracks';
import { DownloadJobDataType } from '@/bullmq/types';
import { SandboxedJob } from 'bullmq';

export default async (job: SandboxedJob<DownloadJobDataType>) => {
	console.log(`Processing job ${job.id}...`, { data: job.data });
	const { clubId, artistId, trackIds } = job.data;

	const updateProgress = job.updateProgress.bind(job);

	const tracks = await filterTracks(artistId, trackIds);
	const count = await downloadMultipleTracks(tracks, clubId, updateProgress);

	console.log(`Successfully downloaded ${count}/${tracks.length} tracks`);
};

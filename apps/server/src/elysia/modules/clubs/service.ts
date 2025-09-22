import { addDownloadJob } from '@/bullmq/queues/download.queue';
import type { ClubModel } from './model';

export abstract class Club {
	static async addDownloadJobToQueue({
		clubId,
		artistId,
		trackIds,
	}: ClubModel.DownloadClubSongsBody): Promise<string | undefined> {
		const job = await addDownloadJob({
			clubId,
			artistId,
			trackIds,
		});

		return job?.id;
	}
}

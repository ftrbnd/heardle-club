import type { ClubModel } from './model';
import { addDownloadJob } from '@/bullmq/queue';

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

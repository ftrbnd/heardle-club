import type { ClubModel } from './model';
import { spotify } from '@/utils/spotify';

export abstract class Club {
	static async downloadClubSongs({
		clubId,
		artistId,
		trackIds,
	}: ClubModel.DownloadClubSongsBody): Promise<ClubModel.DownloadClubSongsResponse> {
		if (trackIds && trackIds.length > 0) {
			// TODO: upload only specified tracks sent by the user
		}
		// TODO: else, upload all tracks from spotify

		return {
			count: -1,
			tracks: [],
		};
	}
}

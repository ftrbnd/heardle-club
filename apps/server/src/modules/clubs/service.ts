import type { ClubModel } from './model';
import { spotify } from '@/utils/spotify';
import { generateClient, searchVideo, downloadAudio } from '@/utils/yt';

export abstract class Club {
	static async downloadClubSongs({
		clubId,
		artistId,
		trackIds,
	}: ClubModel.DownloadClubSongsBody): Promise<void> {
		if (trackIds && trackIds.length > 0) {
			const client = await generateClient();

			for (const id of trackIds) {
				const track = await spotify.tracks.get(id);
				const searchQuery = `${track.artists.map((artist) => artist.name).join(', ')} ${track.name}`;
				console.log({ track: track.name, searchQuery });

				const ytVideo = await searchVideo(client, searchQuery);
				console.log({ foundVideo: ytVideo.title.text });
				await downloadAudio(client, ytVideo.video_id, track.name);
			}
		}
		// TODO: else, upload all tracks from spotify
	}
}

import { sanitizeString } from '@/utils/random';
import type { ClubModel } from './model';
import { spotify } from '@/utils/spotify';
import { generateClient, searchVideo, downloadAudio } from '@/utils/yt';
import { SelectClub } from '@repo/database/postgres';
import { SimplifiedTrack } from '@spotify/web-api-ts-sdk';

async function downloadMultipleTracks(
	tracks: SimplifiedTrack[],
	clubId: string
) {
	const client = await generateClient();

	let count = 0;
	for (const track of tracks) {
		const searchQuery = `${track.artists.map((artist) => artist.name).join(', ')} ${track.name}`;
		console.log({ track: track.name, searchQuery });

		try {
			const ytVideo = await searchVideo(client, searchQuery);
			console.log({ foundVideo: ytVideo.title.text });

			const fileName = sanitizeString(`${clubId}_${track.name}`);
			await downloadAudio(client, ytVideo.video_id, fileName);

			count++;
		} catch (error) {
			console.log(`Failed to download ${track.name}`);
			continue;
		}
	}

	console.log(`Successfully downloaded ${count}/${tracks.length} tracks`);
	return count;
}

export abstract class Club {
	static async downloadClubSongs({
		club,
		artistId,
		trackIds,
	}: ClubModel.DownloadClubSongsBody): Promise<number> {
		// TODO: fix after pr in ./model
		const tempClub = club as SelectClub;

		let tracks: SimplifiedTrack[] = [];

		if (trackIds && trackIds.length > 0) {
			// the tracks that the user submitted
			const trackPromises = trackIds.map((id) => spotify.tracks.get(id));
			tracks = await Promise.all(trackPromises);
		} else {
			// upload all tracks from spotify
			const albums = await spotify.artists.albums(artistId);
			for (const item of albums.items) {
				const album = await spotify.albums.get(item.id);
				tracks.push(...album.tracks.items);
			}
		}

		const count = await downloadMultipleTracks(tracks, tempClub.id);
		return count;
	}
}

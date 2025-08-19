import { sanitizeString } from '@/utils/random';
import type { ClubModel } from './model';
import { spotify } from '@/utils/spotify';
import { generateClient, searchVideo, downloadAudio } from '@/utils/yt';
import {
	generateSecureRandomString,
	SelectClub,
} from '@repo/database/postgres';
import { Album, SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import {
	setDownloadStatus,
	clearDownloadStatus,
	uploadFile,
	insertClubSong,
} from '@repo/database/api';

type TrackWithAlbum =
	| Omit<Track, 'external_ids' | 'popularity'>
	| (SimplifiedTrack & { album: Album });

async function downloadMultipleTracks(
	tracks: TrackWithAlbum[],
	clubId: string
) {
	const client = await generateClient();

	let count = 0;
	for (const track of tracks) {
		const searchQuery = `${track.artists.map((artist) => artist.name).join(', ')} ${track.name}`;

		try {
			const ytVideo = await searchVideo(client, searchQuery);

			const fileName = sanitizeString(track.name);
			const path = await downloadAudio(client, ytVideo.video_id, fileName);
			const { id } = await uploadFile(path, clubId, track.id);

			await insertClubSong({
				id: generateSecureRandomString(),
				trackId: track.id,
				title: track.name,
				artist: track.artists.map((artist) => artist.name),
				album: track.album.name,
				image: track.album.images.find((img) => img)?.url,
				audio: id,
				clubId,
			});

			count++;
			await setDownloadStatus(clubId, count, tracks.length);
		} catch (error) {
			if (error instanceof Error)
				console.log(`Failed to download ${track.name}:`, error);
			continue;
		}
	}

	await clearDownloadStatus(clubId);

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

		let tracks: TrackWithAlbum[] = [];

		if (trackIds && trackIds.length > 0) {
			// the tracks that the user submitted
			const trackPromises = trackIds.map((id) => spotify.tracks.get(id));
			tracks = await Promise.all(trackPromises);
		} else {
			// upload all tracks from spotify
			const albums = await spotify.artists.albums(artistId);
			for (const item of albums.items) {
				const album = await spotify.albums.get(item.id);

				const tracksWithAlbum = album.tracks.items.map((item) => ({
					...item,
					album,
				}));

				tracks.push(...tracksWithAlbum);
			}
		}

		const count = await downloadMultipleTracks(tracks, tempClub.id);
		return count;
	}
}

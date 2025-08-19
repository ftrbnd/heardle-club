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
	getRandomSong,
	downloadSong,
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
			const audioFilePath = await downloadAudio(
				client,
				ytVideo.video_id,
				fileName
			);
			const { path } = await uploadFile(audioFilePath, clubId, track.id);

			await insertClubSong({
				id: generateSecureRandomString(),
				trackId: track.id,
				title: track.name,
				artist: track.artists.map((artist) => artist.name),
				album: track.album.name,
				image: track.album.images.find((img) => img)?.url,
				audio: path,
				duration: ytVideo.duration.seconds,
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

async function getRandomStartTime(duration: number): Promise<number> {
	let randomStartTime = Math.floor(Math.random() * duration) - 7;
	randomStartTime = randomStartTime < 0 ? 0 : randomStartTime; // set floor
	randomStartTime =
		randomStartTime + 6 > duration ? duration - 6 : randomStartTime; // set ceiling

	return randomStartTime;
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

	static async setDailySong(clubId: string) {
		const song = await getRandomSong(clubId);
		if (!song) throw new Error('Club has no songs');

		const startTime = await getRandomStartTime(song.duration);
		console.log({ song: song.title, startTime });

		const path = await downloadSong(song.audio);
		console.log({ path });

		return song;
	}
}

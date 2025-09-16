import type { ClubModel } from './model';
import { spotify } from '@/utils/spotify';
import { generateClient, searchVideo, downloadAudio } from '@/utils/yt';
import {
	generateSecureRandomString,
	sanitizeString,
	SelectClub,
} from '@repo/database/postgres';
import { Album, SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import {
	setDownloadStatus,
	uploadClubSongFile,
	insertClubSong,
	getRandomSong,
	downloadSong,
	uploadDailySongFile,
	setClubDailySong,
	getClubById,
} from '@repo/database/api';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { promises } from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath);

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
			const { publicUrl } = await uploadClubSongFile(
				audioFilePath,
				clubId,
				track.id
			);

			await insertClubSong({
				id: generateSecureRandomString(),
				trackId: track.id,
				clubId,
				title: track.name,
				artist: track.artists.map((artist) => artist.name),
				album: track.album.name,
				image: track.album.images.find((img) => img)?.url,
				audio: publicUrl,
				duration: ytVideo.duration.seconds,
				source: 'youtube_download',
			});

			count++;
			await setDownloadStatus(clubId, count, tracks.length);
		} catch (error) {
			if (error instanceof Error)
				console.log(`Failed to download ${track.name}:`, error);
			continue;
		}
	}

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

/**
 * Trim the song audio file to 6 seconds
 * @param path
 */
async function trimSong(
	path: string,
	startTime: number,
	finalPath: string
): Promise<string> {
	const [clubId, dailyFolder, _fileName] = finalPath.split('/');
	await promises.mkdir(`${clubId}/${dailyFolder}`, { recursive: true });

	return new Promise((resolve, reject) => {
		ffmpeg(path)
			.setStartTime(startTime)
			.setDuration(6)
			.on('end', async () => {
				resolve(finalPath);
			})
			.on('error', (err: unknown) => {
				reject(err);
			})
			.save(finalPath);
	});
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

		const path = await downloadSong(song.audio);

		const club = await getClubById(clubId);
		if (!club) throw new Error('Club not found');
		const dayNum = club.heardleDay;

		const finalPath = `${clubId}/daily/${clubId}_day_${dayNum}.mp3`;
		await trimSong(path, startTime, finalPath);

		const { signedUrl } = await uploadDailySongFile(finalPath, clubId);

		await setClubDailySong(clubId, song, signedUrl);

		return song;
	}
}

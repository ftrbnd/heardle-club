import type { ClubModel } from './model';
import { spotify } from '@/utils/spotify';
import { generateClient, searchVideo, downloadAudio } from '@/utils/yt';
import {
	generateSecureRandomString,
	sanitizeString,
} from '@repo/database/common';
import { Album, SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import * as postgres from '@repo/database/postgres/api';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { promises } from 'fs';
import * as supabase from '@repo/database/supabase/api';
import * as redis from '@repo/database/redis/api';
import { SelectClub } from '@repo/database/postgres/schema';

ffmpeg.setFfmpegPath(ffmpegPath);

type TrackWithAlbum =
	| Omit<Track, 'external_ids' | 'popularity'>
	| (SimplifiedTrack & { album: Album });

async function downloadMultipleTracks(
	tracks: TrackWithAlbum[],
	clubId: string
) {
	await redis.setDownloadStatus(clubId, {
		current: 0,
		total: tracks.length,
		done: false,
	});

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
			const { publicUrl } = await supabase.uploadClubSongFile(
				audioFilePath,
				clubId,
				track.id
			);

			await postgres.insertClubSong({
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
			await redis.setDownloadStatus(clubId, {
				current: count,
				total: tracks.length,
			});
		} catch (error) {
			if (error instanceof Error)
				console.log(`Failed to download ${track.name}:`, error);
			continue;
		}
	}

	await redis.setDownloadStatus(clubId, {
		current: count,
		total: tracks.length,
		done: true,
	});

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
 */
async function trimSong(
	path: `${string}/${string}.mp3`,
	startTime: number,
	finalPath: `${string}/daily/${string}_day_${number}.mp3`
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
		const song = await postgres.getRandomSong(clubId);
		console.log({ song });
		if (!song) throw new Error('Club has no songs');

		const startTime = await getRandomStartTime(song.duration);
		console.log({ startTime });

		const path = await supabase.downloadSong(clubId, song);
		console.log({ path });

		const club = await postgres.getClubById(clubId);
		if (!club) throw new Error('Club not found');
		const newDayNum = club.heardleDay + 1;
		console.log({ club, newDayNum });

		const finalPath = `${clubId}/daily/${clubId}_day_${newDayNum}.mp3` as const;
		console.log({ finalPath });
		await trimSong(path, startTime, finalPath);

		const { signedUrl } = await supabase.uploadDailySongFile(finalPath);
		console.log({ signedUrl });

		await redis.setClubDailySong(clubId, song, signedUrl);
		await postgres.updateClubDayNumber(clubId, newDayNum);

		return song;
	}
}

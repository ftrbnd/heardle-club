import { generateClient, searchVideo, downloadAudio } from '@/server/utils/yt';
import {
	generateSecureRandomString,
	sanitizeString,
} from '@repo/database/common';
import { Album, SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import * as postgres from '@repo/database/postgres/api';
import * as supabase from '@repo/database/supabase/api';
import Innertube from 'youtubei.js';
import { spotify } from '@/server/utils/spotify';
import { JobProgress } from 'bullmq';

type TrackWithAlbum =
	| Omit<Track, 'external_ids' | 'popularity'>
	| (SimplifiedTrack & { album: Album });

export async function downloadMultipleTracks(
	tracks: TrackWithAlbum[],
	clubId: string,
	updateProgress: (value: JobProgress) => Promise<void>
) {
	await updateProgress({
		currentTrack: null,
		currentStep: 0,
		totalTracks: tracks.length,
		percentage: 0,
	});

	const client = await generateClient();

	let count = 0;
	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		try {
			await downloadSingleTrack(
				track,
				clubId,
				client,
				updateProgress,
				i,
				tracks.length
			);
			count++;

			await updateProgress({
				currentTrack: track.name,
				currentStep: i + 1,
				totalTracks: tracks.length,
				percentage: Math.floor(count / tracks.length),
			});
		} catch (error) {
			if (error instanceof Error)
				console.log(`Failed to download ${track.name}:`, error);
			continue;
		}
	}

	await updateProgress({
		currentTrack: null,
		currentStep: tracks.length,
		totalTracks: tracks.length,
		percentage: 100,
	});

	return count;
}

export async function downloadSingleTrack(
	track: TrackWithAlbum,
	clubId: string,
	innertube: Innertube,
	updateProgress: (value: JobProgress) => Promise<void>,
	currentTrackIndex: number,
	totalTracks: number
) {
	// TODO: fix setting 0 in the middle of downloads
	async function updateSubProgress(step: number, totalSteps: number = 4) {
		const trackProgress = (currentTrackIndex + step / totalSteps) / totalTracks;
		const progressPercent = Math.floor(trackProgress * 100);
		await updateProgress({
			currentTrack: track.name,
			currentStep: currentTrackIndex,
			totalTracks,
			percentage: progressPercent,
		});
	}

	const searchQuery = `${track.artists.map((artist) => artist.name).join(', ')} ${track.name}`;
	const ytVideo = await searchVideo(innertube, searchQuery);
	await updateSubProgress(1);

	const fileName = sanitizeString(track.name);
	const audioFilePath = await downloadAudio(
		innertube,
		ytVideo.video_id,
		fileName
	);
	await updateSubProgress(2);

	const { publicUrl } = await supabase.uploadClubSongFile(
		audioFilePath,
		clubId,
		track.id
	);
	await updateSubProgress(3);

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
	await updateSubProgress(4);
}

export async function filterTracks(artistId: string, trackIds?: string[]) {
	let tracks: TrackWithAlbum[] = [];

	if (trackIds && trackIds.length > 0) {
		// the tracks that the user manually submitted
		const trackPromises = trackIds.map((id) => spotify.tracks.get(id));
		tracks = await Promise.all(trackPromises);
	} else {
		// automatically upload all tracks from spotify
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

	return tracks;
}

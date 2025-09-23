import * as postgres from '@repo/database/postgres/api';
import * as supabase from '@repo/database/supabase/api';
import * as redis from '@repo/database/redis/api';
import * as audio from '@/bullmq/processors/audio';
import { JobProgress } from 'bullmq';

export async function setDailySong(
	clubId: string,
	updateProgress: (progress: JobProgress) => Promise<void>
) {
	await updateProgress({
		message: 'Setting new daily song...',
		percentage: 15,
	});

	const song = await postgres.getRandomSong(clubId);
	console.log({ song });
	if (!song) throw new Error('Club has no songs');

	await updateProgress({
		message: 'Setting start time...',
		percentage: 20,
	});

	const startTime = await getRandomStartTime(song.duration);
	console.log({ startTime });

	await updateProgress({
		message: 'Download song...',
		percentage: 35,
	});

	const path = await supabase.downloadSong(clubId, song);
	console.log({ path });

	const club = await postgres.getClubById(clubId);
	if (!club) throw new Error('Club not found');
	const newDayNum = club.heardleDay + 1;
	console.log({ club, newDayNum });

	await updateProgress({
		message: 'Trimming audio...',
		percentage: 45,
	});

	const finalPath = `${clubId}/daily/${clubId}_day_${newDayNum}.mp3` as const;
	console.log({ finalPath });
	await audio.trimSong(path, startTime, finalPath);

	await updateProgress({
		message: 'Uploading...',
		percentage: 75,
	});

	const { signedUrl } = await supabase.uploadDailySongFile(finalPath);
	console.log({ signedUrl });

	await updateProgress({
		message: 'Uploading...',
		percentage: 95,
	});

	await redis.setClubDailySong(clubId, song, signedUrl);
	await postgres.updateClubDayNumber(clubId, newDayNum);

	return song;
}

async function getRandomStartTime(duration: number): Promise<number> {
	let randomStartTime = Math.floor(Math.random() * duration) - 7;
	randomStartTime = randomStartTime < 0 ? 0 : randomStartTime; // set floor
	randomStartTime =
		randomStartTime + 6 > duration ? duration - 6 : randomStartTime; // set ceiling

	return randomStartTime;
}

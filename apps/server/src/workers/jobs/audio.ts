import { promises } from 'fs';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Trim the song audio file to 6 seconds
 */
export async function trimSong(
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

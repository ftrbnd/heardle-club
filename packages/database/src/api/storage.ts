import { supabase } from '../supabase';
import { promises, readFileSync, unlinkSync } from 'fs';

const SONGS_BUCKET = 'club.songs' as const;

export const uploadFile = async (
	path: string,
	clubId: string,
	trackId: string
) => {
	const fileBuffer = readFileSync(path);

	const { data, error } = await supabase.storage
		.from(SONGS_BUCKET)
		.upload(`${clubId}/${path}`, fileBuffer, {
			contentType: 'audio/mp3',
			metadata: {
				trackId,
			},
			upsert: true,
		});
	if (error) throw error;

	console.log(`Uploaded ${data.fullPath} to Supabase`);

	unlinkSync(path);
	console.log(`Deleted ${path} file locally`);

	return data;
};

export const downloadSong = async (path: string) => {
	const { data, error } = await supabase.storage
		.from(SONGS_BUCKET)
		.download(path);
	if (error) throw error;

	const arrayBuffer = await data.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const [folderPath, _filePath] = path.split('/');

	await promises.mkdir(folderPath, { recursive: true });
	await promises.writeFile(path, buffer);

	return path;
};

import { supabase } from '../supabase';
import { readFileSync, unlinkSync } from 'fs';

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

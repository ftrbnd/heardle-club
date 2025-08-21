import { generateSecureRandomString } from '../postgres';
import { supabase } from '../supabase';
import { promises, readFileSync, unlinkSync } from 'fs';

const SONGS_BUCKET = 'club.songs' as const;
const AVATARS_BUCKET = 'user.avatars' as const;

export const uploadClubSongFile = async (
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

export const uploadDailySongFile = async (path: string, clubId: string) => {
	const fileBuffer = readFileSync(path);

	const { data: uploadData, error: uploadError } = await supabase.storage
		.from(SONGS_BUCKET)
		.upload(path, fileBuffer, {
			contentType: 'audio/mp3',
			upsert: true,
		});
	if (uploadError) throw uploadError;

	const { data: urlData, error: urlError } = await supabase.storage
		.from(SONGS_BUCKET)
		.createSignedUrl(path, 172800); // expires in 48 hours
	if (urlError) throw urlError;

	console.log(`Uploaded ${uploadData.fullPath} to Supabase`);

	unlinkSync(path);
	console.log(`Deleted ${path} file locally`);

	return urlData;
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

export const uploadUserAvatar = async (userId: string, image: File) => {
	const imageType = image.type.split('/')[1];
	// guarantees image isn't cached
	const imagePath = `${userId}/${generateSecureRandomString()}.${imageType}`;

	const { error: uploadError } = await supabase.storage
		.from(AVATARS_BUCKET)
		.upload(imagePath, image, {
			contentType: image.type,
			upsert: true,
		});
	if (uploadError) throw uploadError;

	const { data: urlData } = supabase.storage
		.from(AVATARS_BUCKET)
		.getPublicUrl(imagePath); // expires in 48 hours

	return urlData;
};

export const removeUserAvatars = async (userId: string) => {
	const { data: folder, error } = await supabase.storage
		.from(AVATARS_BUCKET)
		.list(userId);
	if (error) throw error;
	if (!folder) return;

	if (folder.length === 0) return;

	const paths = folder.map((file) => `${userId}/${file.name}`);
	const { error: removeError } = await supabase.storage
		.from(AVATARS_BUCKET)
		.remove(paths);
	if (removeError) throw removeError;
};

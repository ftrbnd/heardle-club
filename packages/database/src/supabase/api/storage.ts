import { supabase } from '..';
import { promises, readFileSync, unlinkSync } from 'fs';
import { SelectBaseSong } from '../../postgres/schema/types';
import { generateSecureRandomString, sanitizeString } from '../../common';

const SONGS_BUCKET = 'club.songs' as const;
const AVATARS_BUCKET = 'user.avatars' as const;

export const uploadClubSongFile = async (
	path: string,
	clubId: string,
	trackId: string
) => {
	const fileBuffer = readFileSync(path);
	const filePath = `${clubId}/${path}`;

	const { data, error } = await supabase.storage
		.from(SONGS_BUCKET)
		.upload(filePath, fileBuffer, {
			contentType: 'audio/mp3',
			metadata: {
				trackId,
			},
			upsert: true,
		});
	if (error) throw new Error(`Failed to upload ${filePath}:`, error);
	console.log(`Uploaded ${data.fullPath} to Supabase`);

	const { data: urlData } = supabase.storage
		.from(SONGS_BUCKET)
		.getPublicUrl(filePath);

	unlinkSync(path);
	console.log(`Deleted ${path} file locally`);

	return urlData;
};

export const uploadCustomClubSongFile = async (
	file: File,
	clubId: string,
	name: string
) => {
	const path = `${clubId}/${name}`;

	const { data, error } = await supabase.storage
		.from(SONGS_BUCKET)
		.upload(path, file, {
			contentType: 'audio/mp3',
			metadata: {
				isCustom: true,
			},
			upsert: true,
		});
	if (error) throw new Error(`Failed to upload custom file ${path}:`, error);
	console.log(`Uploaded ${data.fullPath} to Supabase`);

	const { data: urlData } = supabase.storage
		.from(SONGS_BUCKET)
		.getPublicUrl(path);

	return urlData;
};

export const uploadDailySongFile = async (path: string) => {
	const fileBuffer = readFileSync(path);

	const { data: uploadData, error: uploadError } = await supabase.storage
		.from(SONGS_BUCKET)
		.upload(path, fileBuffer, {
			contentType: 'audio/mp3',
			upsert: true,
		});
	if (uploadError)
		throw new Error(`Failed to upload daily song ${path}:`, uploadError);

	const { data: urlData, error: urlError } = await supabase.storage
		.from(SONGS_BUCKET)
		.createSignedUrl(path, 172800); // expires in 48 hours
	if (urlError)
		throw new Error(`Failed to create signed URL from ${path}:`, urlError);

	console.log(`Uploaded ${uploadData.fullPath} to Supabase`);

	unlinkSync(path);
	console.log(`Deleted ${path} file locally`);

	return urlData;
};

export const downloadSong = async (clubId: string, song: SelectBaseSong) => {
	const path = `${clubId}/${sanitizeString(song.title)}.mp3` as const;

	const { data, error } = await supabase.storage
		.from(SONGS_BUCKET)
		.download(path);
	if (error) throw new Error(`Failed to download ${path}:`, error);

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
	if (uploadError)
		throw new Error(`Failed to upload avatar for User ${userId}:`, uploadError);

	const { data: urlData } = supabase.storage
		.from(AVATARS_BUCKET)
		.getPublicUrl(imagePath);

	return urlData;
};

export const removeUserAvatars = async (userId: string) => {
	const { data: folder, error } = await supabase.storage
		.from(AVATARS_BUCKET)
		.list(userId);
	if (error)
		throw new Error(`Failed to list avatars from User ${userId}:`, error);
	if (!folder) return;

	if (folder.length === 0) return;

	const paths = folder.map((file) => `${userId}/${file.name}`);
	const { error: removeError } = await supabase.storage
		.from(AVATARS_BUCKET)
		.remove(paths);
	if (removeError)
		throw new Error(
			`Failed to remove ${paths} from avatars bucket:`,
			removeError
		);
};

export const removeClubSongFile = async (song: SelectBaseSong) => {
	const path = `${song.clubId}/${sanitizeString(song.title)}.mp3`;
	const { error: removeError } = await supabase.storage
		.from(SONGS_BUCKET)
		.remove([path]);
	if (removeError)
		throw new Error(`Failed to remove ${path} from songs bucket:`, removeError);
};

export const upsertSongFile = async (file: File, song: SelectBaseSong) => {
	const path = `${song.clubId}/${sanitizeString(song.title)}.mp3`;

	const { data, error } = await supabase.storage
		.from(SONGS_BUCKET)
		.upload(path, file, {
			contentType: 'audio/mp3',
			upsert: true,
			metadata: {
				trackId: song.trackId,
			},
		});
	if (error)
		throw new Error(`Failed to upsert ${path} to songs bucket:`, error);
	console.log(`Replaced ${song.title} (${data.fullPath}) audio in Supabase`);

	const { data: urlData } = supabase.storage
		.from(SONGS_BUCKET)
		.getPublicUrl(path);

	return urlData;
};

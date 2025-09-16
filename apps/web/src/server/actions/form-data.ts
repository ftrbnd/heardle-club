import {
	insertBaseSongSchema,
	selectUserSchema,
} from '@repo/database/postgres';
import z from 'zod/v4';

export const updateAccountSchema = selectUserSchema
	.pick({
		displayName: true,
	})
	.extend({
		avatar: z
			.file({
				error: 'Invalid file',
			})
			.max(2_000_000)
			.mime(['image/png', 'image/jpeg', 'application/octet-stream'], {
				error: 'Upload either a PNG or JPEG image',
			})
			.optional(),
	});

export const uploadSongSchema = insertBaseSongSchema
	.pick({
		title: true,
		artist: true,
		album: true,
	})
	.extend({
		audioFile: z
			.file({
				error: 'Only MP3 files are allowed',
			})
			.min(1)
			.max(10_000_000)
			.mime('audio/mpeg')
			.optional(),
	});

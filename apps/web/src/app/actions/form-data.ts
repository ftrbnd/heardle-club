import {
	insertBaseSongSchema,
	selectUserSchema,
} from '@repo/database/postgres/schema';
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

const audioFileSchema = z
	.file({
		error: 'Only MP3 files are allowed',
	})
	.min(1, 'Audio file required')
	.max(10_000_000)
	.mime('audio/mpeg')
	.optional();

export const uploadSongSchema = insertBaseSongSchema
	.pick({
		title: true,
		artist: true,
		album: true,
		duration: true,
	})
	.extend({
		title: z.string().nullable().optional(),
		artist: z.string().nullable().array().nullable().optional(),
		album: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		audioFile: audioFileSchema,
	});
export type UploadSongBody = z.infer<typeof uploadSongSchema>;

import z from 'zod/v4';
import {
	customSongSchema,
	dailySongSchema,
	heardleSongSchema,
} from './schema.js';

export type HeardleSong = z.infer<typeof heardleSongSchema>;
export type DailySong = z.infer<typeof dailySongSchema>;
export type CustomSong = z.infer<typeof customSongSchema>;

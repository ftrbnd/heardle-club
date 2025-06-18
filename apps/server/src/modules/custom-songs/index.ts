// Controller handle HTTP related eg. routing, request validation
import { Elysia } from 'elysia';

import { CustomSong } from './service';
import { CustomSongModel } from './model';

export const customSongs = new Elysia({ prefix: '/custom' }).get(
	'/',
	async ({ body }) => {
		const response = await CustomSong.createSong(body);

		return response;
	},
	{
		body: CustomSongModel.createSongBody,
		response: {
			200: CustomSongModel.createSongResponse,
			400: CustomSongModel.createSongInvalid,
		},
	}
);

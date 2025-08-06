// Controller handle HTTP related eg. routing, request validation
import { Elysia, status } from 'elysia';

import { Club } from './service';
import { ClubModel } from './model';
import { getClubById, getUserById } from '@repo/database/api';

export const clubs = new Elysia({ prefix: '/clubs' }).post(
	'/:clubId',
	async ({ body, params: { clubId } }) => {
		const { userId, trackIds } = body;

		const user = await getUserById(userId);
		if (!user) return status(401, 'Unauthorized');

		const club = await getClubById(clubId);
		if (!club) return status(404, 'Club not found');

		if (club.ownerId !== userId) return status(401, 'Unauthorized');

		Club.downloadClubSongs({
			clubId,
			artistId: club.artistId,
			trackIds,
		});

		return {
			code: 200,
			response: 'Tracks received by server',
		};
	},
	{
		body: ClubModel.initializeClubSongsBody,
		response: {
			200: ClubModel.downloadClubSongsResponse,
			400: ClubModel.downloadClubSongsInvalid,
			401: ClubModel.unauthorized,
			404: ClubModel.notFound,
		},
	}
);

// Controller handle HTTP related eg. routing, request validation
import { Elysia, sse, status } from 'elysia';

import { Club } from './service';
import { ClubModel } from './model';
import { getClubById } from '@repo/database/postgres/api';
import { authService } from '@/elysia/modules/auth';
import { getDownloadJobProgress } from '@/bullmq/queue';

export const clubs = new Elysia({ prefix: '/clubs' })
	.use(authService)
	.post(
		'/:clubId/download',
		async ({ user, body: { trackIds }, params: { clubId } }) => {
			const club = await getClubById(clubId);
			if (!club) return status(404, 'Club not found');

			if (club.ownerId !== user.id) return status(401, 'Unauthorized');

			const jobId = await Club.addDownloadJobToQueue({
				clubId: club.id,
				artistId: club.artistId,
				trackIds,
			});

			return { jobId };
		},
		{
			validateCurrentSession: true,
			body: ClubModel.initializeClubSongsBody,
			response: {
				200: ClubModel.downloadClubSongsResponse,
				400: ClubModel.downloadClubSongsInvalid,
				401: ClubModel.unauthorized,
				404: ClubModel.notFound,
			},
		}
	)
	.get('/:clubId/status', async function* ({ params: { clubId } }) {
		const progress = await getDownloadJobProgress(clubId);
		yield sse({
			data: progress,
		});
	});

// Controller handle HTTP related eg. routing, request validation
import { Elysia } from 'elysia';

import { Club } from './service';
import { ClubModel } from './model';

export const clubs = new Elysia({ prefix: '/clubs' }).post(
	'/',
	async ({ body }) => {
		const response = await Club.createClub(body);

		return response;
	},
	{
		body: ClubModel.createClubBody,
		response: {
			200: ClubModel.createClubResponse,
			400: ClubModel.createClubInvalid,
		},
	}
);

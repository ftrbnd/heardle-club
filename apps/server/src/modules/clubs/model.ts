import { t } from 'elysia';
import { TypeBox } from '@sinclair/typemap';
import { insertClubSchema } from '@repo/database/postgres';

export namespace ClubModel {
	// Define a DTO for Elysia validation
	// TODO: check back for https://github.com/sinclairzx81/typemap/pull/34
	export const createClubBody = TypeBox(insertClubSchema);

	// Define it as TypeScript type
	export type CreateClubBody = typeof createClubBody.static;

	// Repeat for other models
	export const createClubResponse = t.Object({
		clubId: t.String(),
	});

	export type CreateClubResponse = typeof createClubResponse.static;

	export const createClubInvalid = t.Literal('Invalid club id');
	export type CreateClubInvalid = typeof createClubInvalid.static;

	export const initializeClubSongsBody = t.Object({
		trackIds: t.Array(t.String()),
	});
	export type InitializeClubSongsBody = typeof initializeClubSongsBody.static;

	export const downloadClubSongsBody = t.Object({
		club: t.Any(), // TODO: check back above pr
		artistId: t.String(),
		trackIds: t.Optional(t.Array(t.String())),
	});
	export type DownloadClubSongsBody = typeof downloadClubSongsBody.static;

	export const downloadClubSongsResponse = t.Literal(
		'Tracks received by server'
	);
	export type DownloadClubSongsResponse =
		typeof downloadClubSongsResponse.static;

	export const downloadClubSongsInvalid = t.Literal(
		'A club with this artist already exists'
	);
	export type DownloadClubSongsInvalid = typeof downloadClubSongsInvalid.static;

	export const unauthorized = t.Literal('Unauthorized');
	export type Unauthorized = typeof unauthorized.static;

	export const notFound = t.Literal('Club not found');
	export type NotFound = typeof notFound.static;
}

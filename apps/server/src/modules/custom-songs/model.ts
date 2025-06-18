import { t } from 'elysia';

export namespace CustomSongModel {
	// Define a DTO for Elysia validation
	export const createSongBody = t.Object({
		song: t.String(),
		startTime: t.Number(),
		userId: t.String(),
		clubId: t.String(),
	});

	// Define it as TypeScript type
	export type CreateSongBody = typeof createSongBody.static;

	// Repeat for other models
	export const createSongResponse = t.Object({
		song: t.String(),
	});

	export type CreateSongResponse = typeof createSongResponse.static;

	export const createSongInvalid = t.Literal('Invalid song or start time');
	export type CreateSongInvalid = typeof createSongInvalid.static;
}

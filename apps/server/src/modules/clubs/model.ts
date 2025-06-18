import { t } from 'elysia';
import { TypeBox } from '@sinclair/typemap';
import { insertClubSchema } from '@repo/database/postgres';

export namespace ClubModel {
	// Define a DTO for Elysia validation
	// TODO: check back for https://github.com/sinclairzx81/typemap/pull/34
	export const createClubBody = TypeBox(insertClubSchema);

	// Define it as TypeScript type
	export type createClubBody = typeof createClubBody.static;

	// Repeat for other models
	export const createClubResponse = t.Object({
		clubId: t.String(),
	});

	export type createClubResponse = typeof createClubResponse.static;

	export const createClubInvalid = t.Literal('Invalid club id');
	export type createClubInvalid = typeof createClubInvalid.static;
}

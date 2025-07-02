import { t } from 'elysia';

enum OAuthProvider {
	spotify,
	discord,
}

export namespace AuthModel {
	export const createAuthorizationURLBody = t.Object({
		provider: t.Enum(OAuthProvider),
	});

	export type CreateAuthorizationURLBody =
		typeof createAuthorizationURLBody.static;

	export const redirectToAuthorizationURL = t.Object({
		authorizationURL: t.String(),
	});

	export type RedirectToAuthorizationURL =
		typeof redirectToAuthorizationURL.static;
}

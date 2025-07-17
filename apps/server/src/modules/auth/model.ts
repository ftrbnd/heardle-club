import { oauthProvider } from '@/modules/auth/providers.config';
import { t } from 'elysia';

export namespace AuthModel {
	export const authHeaders = t.Object({
		authorization: t.String(),
	});
	export type AuthHeaders = typeof authHeaders.static;

	export const loginProviderParams = t.Object({
		provider: oauthProvider,
	});
	export type LoginProviderParams = typeof loginProviderParams.static;

	export const oauthStateCookies = t.Cookie({
		SPOTIFY_OAUTH_STATE: t.Optional(t.String()),
		DISCORD_OAUTH_STATE: t.Optional(t.String()),
		session_token: t.Optional(t.String()),
	});
	export type OAuthStateCookies = typeof oauthStateCookies.static;

	export const redirectResponse = t.Literal('Redirecting to provider');
	export type RedirectResponse = typeof redirectResponse.static;

	export const invalidProviderCookie = t.Literal('Invalid provider cookie');
	export type InvalidProviderCookie = typeof invalidProviderCookie.static;

	export const loginCallbackQuery = t.Object({
		code: t.String(),
		state: t.String(),
	});
	export type LoginCallbackQuery = typeof loginCallbackQuery.static;

	export const unauthorized = t.Literal('Unauthorized');
	export type Unauthorized = typeof unauthorized.static;
}

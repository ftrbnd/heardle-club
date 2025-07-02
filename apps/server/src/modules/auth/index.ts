import { AuthModel } from '@/modules/auth/model';
import { Auth } from '@/modules/auth/service';
import { validateSessionToken } from '@/modules/auth/session';
import { Elysia, redirect, status } from 'elysia';

export const auth = new Elysia({ prefix: '/auth' }).group(
	'/login/:provider',
	{
		params: AuthModel.loginProviderParams,
		cookie: AuthModel.oauthStateCookies,
	},
	(app) =>
		app
			.macro({
				currentSession: () => ({
					async resolve({ cookie }) {
						const token = cookie.session_token.value;
						if (!token) return { session: null };

						const session = await validateSessionToken(token);
						return { session };
					},
				}),
			})
			.get(
				'/',
				async ({ params: { provider }, cookie, set }) => {
					const { state, url } = await Auth.createAuthorizationURL({
						provider,
					});

					const providerCookie =
						provider === 'spotify'
							? cookie.SPOTIFY_OAUTH_STATE
							: provider === 'discord'
								? cookie.DISCORD_OAUTH_STATE
								: null;
					if (!providerCookie)
						return status(
							400,
							'Invalid provider cookie' satisfies AuthModel.InvalidProviderCookie
						);

					providerCookie.set({
						value: state,
						secure: process.env.NODE_ENV === 'production',
						maxAge: 1 * 60 * 60, // 1 hour
						domain:
							process.env.NODE_ENV === 'production'
								? 'heardle.club'
								: undefined,
					});

					set.headers = { location: url.toString() };
					return redirect(url.href, 302);
				},
				{
					response: {
						302: AuthModel.redirectResponse,
						400: AuthModel.invalidProviderCookie,
					},
				}
			)
			.get(
				'/callback',
				async ({
					params: { provider },
					query: { code, state },
					set,
					redirect,
					cookie,
				}) => {
					const storedState = (
						provider === 'spotify'
							? cookie.SPOTIFY_OAUTH_STATE
							: provider === 'discord'
								? cookie.DISCORD_OAUTH_STATE
								: null
					)?.value;

					if (!code || !state || !storedState) {
						return status(401, 'Unauthorized');
					}
					if (state !== storedState) {
						return status(401, 'Unauthorized');
					}

					const providerUserDetails = await Auth.getProviderUserDetails(
						provider,
						code
					);

					const existingUser = await Auth.getExistingUser(
						providerUserDetails.email
					);
					const { sessionExpiresAt } = await Auth.setUserDetails(
						provider,
						existingUser,
						providerUserDetails
					);

					cookie.session_token.set({
						httpOnly: true,
						path: '/',
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'lax',
						expires: sessionExpiresAt,
						domain:
							process.env.NODE_ENV === 'production'
								? 'heardle.club'
								: undefined,
					});

					set.headers = { location: '/' };
					return redirect('/', 302);
				},
				{
					query: AuthModel.loginCallbackQuery,
					response: {
						401: AuthModel.unauthorized,
					},
					currentSession: true,
				}
			)
);

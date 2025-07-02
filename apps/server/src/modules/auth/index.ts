import { AuthModel } from '@/modules/auth/model';
import {
	getProviderEndpoint,
	getTokens,
} from '@/modules/auth/providers.config';
import { Auth } from '@/modules/auth/service';
import {
	createSession,
	inactivityTimeoutSeconds,
	validateSessionToken,
} from '@/modules/auth/session';
import { generateSecureRandomString } from '@/utils/random';
import {
	addOAuthAccount,
	getUserByEmail,
	insertUser,
} from '@repo/database/api';
import { OAuth2Tokens } from 'arctic';
import { Elysia, redirect, status } from 'elysia';

export const auth = new Elysia({ prefix: '/auth' })
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
		'/login/:provider',
		async ({ params: { provider }, cookie, set }) => {
			const { state, url } = await Auth.createAuthorizationURL({ provider });

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
					process.env.NODE_ENV === 'production' ? 'heardle.club' : undefined,
			});

			set.headers = { location: url.toString() };
			return redirect(url.href, 302);
		},
		{
			params: AuthModel.loginProviderParams,
			cookie: AuthModel.oauthStateCookies,
			response: {
				302: AuthModel.redirectResponse,
				400: AuthModel.invalidProviderCookie,
			},
		}
	)
	.get(
		'/login/:provider/callback',
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

			let tokens: OAuth2Tokens;
			try {
				tokens = await getTokens(provider, code, null);
			} catch {
				return status(401, 'Unauthorized');
			}

			const providerUserResponse = await fetch(getProviderEndpoint(provider), {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`,
				},
			});
			const providerUserDetails = await providerUserResponse.json();

			const existingUser = await getUserByEmail(providerUserDetails.email);
			if (existingUser) {
				const session = await createSession(existingUser.id);
				await addOAuthAccount({
					id: generateSecureRandomString(),
					provider,
					providerUserId: providerUserDetails.id,
					userId: existingUser.id,
				});

				const expiresAt = new Date(
					session.lastVerifiedAt.getTime() + inactivityTimeoutSeconds * 1000
				);
				cookie.session_token.set({
					httpOnly: true,
					path: '/',
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					expires: expiresAt,
				});

				set.headers = { location: '/' };
				return redirect('/', 302);
			}

			const userId = generateSecureRandomString();
			const { user } = await insertUser(
				{
					id: userId,
					email: providerUserDetails.email,
				},
				{
					id: generateSecureRandomString(),
					provider,
					providerUserId: providerUserDetails.id,
					userId,
				}
			);

			const session = await createSession(user.id);
			const expiresAt = new Date(
				session.lastVerifiedAt.getTime() + inactivityTimeoutSeconds * 1000
			);
			cookie.session_token.set({
				httpOnly: true,
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				expires: expiresAt,
			});

			set.headers = { location: '/' };
			return redirect('/', 302);
		},
		{
			params: AuthModel.loginProviderParams,
			query: AuthModel.loginCallbackQuery,
			cookie: AuthModel.oauthStateCookies,
			response: {
				401: AuthModel.unauthorized,
			},
			currentSession: true,
		}
	);

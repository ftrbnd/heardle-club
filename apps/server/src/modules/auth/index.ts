import { AuthModel } from '@/modules/auth/model';
import { Auth } from '@/modules/auth/service';
import { deleteSession, validateSessionToken } from '@/modules/auth/session';
import { rootDomain, rootURL } from '@/utils/domains';
import { getUserById } from '@repo/database/api';
import { Elysia, status, t } from 'elysia';

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
		'/me',
		async ({ headers }) => {
			const bearerToken = headers.authorization;
			const token = bearerToken.split(' ')[1];

			const session = await validateSessionToken(token);
			const user = await getUserById(session?.userId);

			return { user };
		},
		{
			headers: AuthModel.authHeaders,
		}
	)
	.get(
		'/login/:provider',
		async ({ params: { provider }, cookie }) => {
			const { state, url } = await Auth.createAuthorizationURL({
				provider,
			});

			const providerCookie = cookie[`${provider}_oauth_state`];
			providerCookie.set({
				value: state,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1 * 60 * 60, // 1 hour
				domain: rootDomain,
			});

			return new Response(null, {
				status: 302,
				headers: {
					location: url.href,
				},
			});
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
		async ({ params: { provider }, query: { code, state }, cookie }) => {
			const providerCookie = cookie[`${provider}_oauth_state`];
			const storedState = providerCookie?.value;

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
			const { sessionExpiresAt, sessionToken } = await Auth.setUserDetails(
				provider,
				existingUser,
				providerUserDetails
			);

			cookie.session_token.set({
				value: sessionToken,
				httpOnly: true,
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				expires: sessionExpiresAt,
				domain: rootDomain,
			});

			return new Response(null, {
				status: 302,
				headers: {
					location: rootURL,
				},
			});
		},
		{
			params: AuthModel.loginProviderParams,
			cookie: AuthModel.oauthStateCookies,
			query: AuthModel.loginCallbackQuery,
			response: {
				401: AuthModel.unauthorized,
			},
			currentSession: true,
		}
	)
	.get(
		'/logout',
		async ({ headers }) => {
			const bearerToken = headers.authorization;
			const token = bearerToken.split(' ')[1];

			const session = await validateSessionToken(token);
			if (session) await deleteSession(session.id);

			return new Response(null, {
				status: 204,
			});
		},
		{
			headers: AuthModel.authHeaders,
		}
	)
	.onError(({ error }) => {
		console.log(error);
	});

import { AuthModel } from '@/server/modules/auth/model';
import { Auth } from '@/server/modules/auth/service';
import {
	deleteSession,
	validateSessionToken,
} from '@/server/modules/auth/session';
import { rootDomain, rootURL } from '@/server/utils/domains';
import { getUserById } from '@repo/database/postgres/api';
import { Elysia, status } from 'elysia';

export const authService = new Elysia({ name: 'auth_service' }).macro({
	validateCurrentSession: {
		resolve: async ({ headers, status }) => {
			const authHeader = headers['authorization'];
			if (!authHeader) return status(401);

			const token = authHeader.startsWith('Bearer ')
				? authHeader.slice(7)
				: null;
			if (!token) return status(401);

			const session = await validateSessionToken(token);
			if (!session) return status(401);

			const user = await getUserById(session.userId);
			if (!user) return status(401);

			return { session, user };
		},
	},
});

export const auth = new Elysia({ prefix: '/auth' })
	.use(authService)
	.get(
		'/me',
		async ({ user }) => {
			return { user };
		},
		{
			validateCurrentSession: true,
		}
	)
	.get(
		'/logout',
		async ({ session }) => {
			await deleteSession(session.id);

			return new Response(null, {
				status: 204,
			});
		},
		{
			validateCurrentSession: true,
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

			const loginReferrer = cookie.login_referrer.value;

			return new Response(null, {
				status: 302,
				headers: {
					location: loginReferrer ?? rootURL,
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
		}
	);

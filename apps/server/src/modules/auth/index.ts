import { AuthModel } from '@/modules/auth/model';
import { Auth } from '@/modules/auth/service';
import { Elysia, status } from 'elysia';

export const auth = new Elysia({ prefix: '/auth' }).get(
	'/login/:provider',
	async ({ params: { provider }, cookie, set, redirect }) => {
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
);

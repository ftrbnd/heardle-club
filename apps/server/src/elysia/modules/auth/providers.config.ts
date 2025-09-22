import { discordRedirectURI, spotifyRedirectURI } from '@/elysia/utils/domains';
import { Discord, Spotify } from 'arctic';
import { t } from 'elysia';

export const oauthProvider = t.Union([
	t.Literal('spotify'),
	t.Literal('discord'),
]);
export type OAuthProvider = typeof oauthProvider.static;

export const spotify = new Spotify(
	process.env.SPOTIFY_CLIENT_ID!,
	process.env.SPOTIFY_CLIENT_SECRET!,
	spotifyRedirectURI
);

export const discord = new Discord(
	process.env.DISCORD_CLIENT_ID!,
	process.env.DISCORD_CLIENT_SECRET!,
	discordRedirectURI
);

export const providerConfigs = {
	spotify: {
		client: spotify,
		scopes: ['user-read-email', 'user-read-private'],
		cookie: 'spotify_oauth_state',
		endpoint: 'https://api.spotify.com/v1/me',
	},
	discord: {
		client: discord,
		scopes: ['identify', 'email'],
		cookie: 'discord_oauth_state',
		endpoint: 'https://discord.com/api/users/@me',
	},
} as const;

export const getProviderScopes = (provider: OAuthProvider) =>
	providerConfigs[provider].scopes;
export const getProviderCookie = (provider: OAuthProvider) =>
	providerConfigs[provider].cookie;
export const getProviderEndpoint = (provider: OAuthProvider) =>
	providerConfigs[provider].endpoint;

export const getAuthorizationURL = (provider: OAuthProvider, state: string) => {
	const config = providerConfigs[provider];
	return config.client.createAuthorizationURL(state, null, [...config.scopes]);
};

export const getTokens = async (
	provider: OAuthProvider,
	code: string,
	codeVerifier: string | null
) => {
	const config = providerConfigs[provider];
	return config.client.validateAuthorizationCode(code, codeVerifier);
};

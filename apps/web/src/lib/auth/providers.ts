import { Discord, Spotify } from 'arctic';

export type OAuthProvider = 'spotify' | 'discord';

export const spotify = new Spotify(
	process.env.SPOTIFY_CLIENT_ID!,
	process.env.SPOTIFY_CLIENT_SECRET!,
	process.env.SPOTIFY_REDIRECT_URI!
);

export const discord = new Discord(
	process.env.DISCORD_CLIENT_ID!,
	process.env.DISCORD_CLIENT_SECRET!,
	process.env.DISCORD_REDIRECT_URI!
);

const providerScopes = new Map<OAuthProvider, string[]>([
	['spotify', ['user-read-private', 'user-read-email']],
	['discord', ['identify', 'email']],
]);

export const providerCookies = new Map<OAuthProvider, string>([
	['spotify', 'SPOTIFY_OAUTH_STATE'],
	['discord', 'DISCORD_OAUTH_STATE'],
]);

export const providerEndpoints = new Map<OAuthProvider, string>([
	['spotify', 'https://api.spotify.com/v1/me'],
	['discord', 'https://discord.com/api/users/@me'],
]);

export const getAuthorizationURL = (provider: OAuthProvider, state: string) => {
	switch (provider) {
		case 'spotify':
			return spotify.createAuthorizationURL(
				state,
				null,
				providerScopes.get('spotify') ?? []
			);
		case 'discord':
			return discord.createAuthorizationURL(
				state,
				null,
				providerScopes.get('discord') ?? []
			);
	}
};

export const getTokens = async (
	provider: OAuthProvider,
	code: string,
	codeVerifier: string | null
) => {
	switch (provider) {
		case 'spotify':
			return spotify.validateAuthorizationCode(code, codeVerifier);
		case 'discord':
			return discord.validateAuthorizationCode(code, codeVerifier);
	}
};

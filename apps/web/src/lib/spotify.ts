import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export const sdk = SpotifyApi.withClientCredentials(
	process.env.SPOTIFY_CLIENT_ID!,
	process.env.SPOTIFY_CLIENT_SECRET!,
	['user-read-email', 'user-read-private']
);

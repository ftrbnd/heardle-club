import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const sdk = SpotifyApi.withClientCredentials(
	process.env.SPOTIFY_CLIENT_ID!,
	process.env.SPOTIFY_CLIENT_SECRET!,
	['user-read-email', 'user-read-private']
);

export async function searchArtist(artist: string) {
	if (artist === '') return [];

	const res = await sdk.search(artist, ['artist']);

	return res.artists.items;
}

export async function getArtist(artistId: string) {
	const res = await sdk.artists.get(artistId);

	return res;
}

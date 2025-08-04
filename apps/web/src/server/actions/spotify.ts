'use server';

import { sdk } from '@/lib/spotify';

export async function searchArtist(artist: string) {
	if (artist === '') return [];

	const res = await sdk.search(artist, ['artist']);

	return res.artists.items;
}

export async function getArtist(artistId: string) {
	const res = await sdk.artists.get(artistId);

	return res;
}

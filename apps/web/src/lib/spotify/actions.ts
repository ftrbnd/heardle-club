'use server';

import { sdk } from '@/lib/spotify';

export async function searchArtist(artist: string) {
	const res = await sdk.search(artist, ['artist']);

	return res;
}

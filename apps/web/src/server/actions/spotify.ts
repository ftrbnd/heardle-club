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

export async function getArtistAlbums(artistId: string) {
	const albums = await sdk.artists.albums(
		artistId,
		'album,single',
		undefined,
		50
	);

	return albums.items;
}

export async function getAlbumTracks(albumId: string) {
	const album = await sdk.albums.get(albumId);

	return album.tracks.items;
}

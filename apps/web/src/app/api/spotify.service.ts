import {
	Artist,
	SimplifiedAlbum,
	SimplifiedTrack,
} from '@spotify/web-api-ts-sdk';

async function spotifyFetch<T>(endpoint: string) {
	const res = await fetch(`/api/spotify${endpoint}`);
	if (!res.ok) throw new Error(res.statusText);
	const data: T = await res.json();
	return data;
}

export async function searchArtist(query: string) {
	const artists = await spotifyFetch<Artist[]>(`/artists?query=${query}}`);
	return artists;
}

export async function getArtist(artistId: string) {
	const artist = await spotifyFetch<Artist>(`/artists/${artistId}}`);
	return artist;
}

export async function getArtistAlbums(artistId: string) {
	const albums = await spotifyFetch<SimplifiedAlbum[]>(
		`/artists/${artistId}/albums`
	);
	return albums;
}

export async function getAlbumTracks(albumId: string) {
	const tracks = await spotifyFetch<SimplifiedTrack[]>(
		`/albums/${albumId}/tracks`
	);
	return tracks;
}

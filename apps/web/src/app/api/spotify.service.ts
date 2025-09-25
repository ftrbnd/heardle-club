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

export async function clientSearchArtist(query: string) {
	const artists = await spotifyFetch<Artist[]>(`/artists?query=${query}}`);
	return artists;
}

export async function clientGetArtist(artistId: string) {
	const artist = await spotifyFetch<Artist>(`/artists/${artistId}}`);
	return artist;
}

export async function clientGetArtistAlbums(artistId: string) {
	const albums = await spotifyFetch<SimplifiedAlbum[]>(
		`/artists/${artistId}/albums`
	);
	return albums;
}

export async function clientGetAlbumTracks(albumId: string) {
	const tracks = await spotifyFetch<SimplifiedTrack[]>(
		`/albums/${albumId}/tracks`
	);
	return tracks;
}

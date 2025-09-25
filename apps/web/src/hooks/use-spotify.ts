import { getAlbumTracks, getArtistAlbums } from '@/app/api/spotify.service';
import { SimplifiedAlbum, SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';

interface UseSpotifyOptions {
	artistId?: string;
	albumId?: string;
}

interface UseSpotifyResult {
	/**
	 * Requires **artistId**
	 */
	artistAlbums?: SimplifiedAlbum[];
	artistAlbumsPending: boolean;
	/**
	 * Requires **artistId** and **albumId**
	 */
	albumTracks?: SimplifiedTrack[];
	albumTracksPending: boolean;
}

export function useSpotify(options: UseSpotifyOptions): UseSpotifyResult {
	const { data: artistAlbums, isPending: artistAlbumsPending } = useQuery({
		queryKey: ['artists', options.artistId, 'albums'],
		queryFn: () => getArtistAlbums(options.artistId),
		enabled: options.artistId !== undefined,
	});

	const { data: albumTracks, isPending: albumTracksPending } = useQuery({
		queryKey: [
			'artists',
			options.artistId,
			'albums',
			options.albumId,
			'tracks',
		],
		queryFn: () => getAlbumTracks(options.albumId),
		enabled: options.artistId !== undefined && options.albumId !== undefined,
	});

	return {
		artistAlbums,
		artistAlbumsPending,
		albumTracks,
		albumTracksPending,
	};
}

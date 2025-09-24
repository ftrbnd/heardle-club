import { AlbumTracks } from '@/components/clubs/songs/album-tracks';
import { AlbumSkeleton } from '@/components/skeletons/album-skeleton';
import { SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface ArtistAlbumsProps {
	albums?: SimplifiedAlbum[];
	isPending: boolean;
	setSelectedAmt: Dispatch<SetStateAction<number>>;
}

export function ArtistAlbums({
	albums,
	isPending,
	setSelectedAmt,
}: ArtistAlbumsProps) {
	return (
		<div className='w-full join join-vertical bg-base-100'>
			{!albums || isPending ? (
				<>
					<AlbumSkeleton />
					<AlbumSkeleton />
					<AlbumSkeleton />
					<AlbumSkeleton />
					<AlbumSkeleton />
				</>
			) : (
				albums.map((album) => (
					<div
						key={album.id}
						className='collapse collapse-arrow bg-base-100 border-base-300 border'>
						<input type='checkbox' />

						<div className='collapse-title font-semibold flex items-center gap-4'>
							<Image
								src={
									album.images.find((image) => image)?.url ??
									'/artist_placeholder.jpg'
								}
								alt={album.name}
								height={50}
								width={50}
							/>
							<p>{album.name}</p>
							<p className='opacity-70 text-xs flex-1 text-end'>
								{album.total_tracks} track{album.total_tracks === 1 ? '' : 's'}
							</p>
						</div>
						<div className='collapse-content text-sm'>
							<AlbumTracks
								album={album}
								setSelectedAmt={setSelectedAmt}
							/>
						</div>
					</div>
				))
			)}
		</div>
	);
}

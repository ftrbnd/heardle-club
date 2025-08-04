import { AlbumTracks } from '@/client/components/clubs/album-tracks';
import { SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';

export function ArtistAlbums({ albums }: { albums: SimplifiedAlbum[] }) {
	return (
		<div className='w-full join join-vertical bg-base-100'>
			{albums.map((album) => (
				<div
					key={album.id}
					className='collapse collapse-arrow bg-base-100 border-base-300 border'>
					<input type='checkbox' />

					<div className='collapse-title font-semibold flex items-center gap-4'>
						<Image
							src={
								album.images.find((image) => image)?.url ??
								'./artist_placeholder.jpg'
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
						<AlbumTracks album={album} />
					</div>
				</div>
			))}
		</div>
	);
}

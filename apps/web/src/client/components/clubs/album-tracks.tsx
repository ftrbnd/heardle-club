'use client';

import { getAlbumTracks } from '@/server/actions/spotify';
import { SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';

interface AlbumTracksProps {
	album: SimplifiedAlbum;
}

export function AlbumTracks({ album }: AlbumTracksProps) {
	const { data: tracks } = useQuery({
		queryKey: ['albums', 'tracks', album.id],
		queryFn: () => getAlbumTracks(album.id),
	});

	const durationFormatted = (duration_ms: number) => {
		const seconds = Math.floor(duration_ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	return (
		<div className='flex flex-col gap-2'>
			{tracks?.map((track) => (
				<div
					key={track.id}
					className='flex gap-2'>
					<input
						type='checkbox'
						className='checkbox'
					/>
					<p className='font-thin opacity-70 min-w-4'>{track.track_number}</p>
					<p className='font-bold flex-1'>{track.name}</p>
					<p className='font-mono self-end'>
						{durationFormatted(track.duration_ms)}
					</p>
				</div>
			))}
		</div>
	);
}

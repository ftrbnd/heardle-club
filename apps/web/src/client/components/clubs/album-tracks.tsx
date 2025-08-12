'use client';

import { clientGetAlbumTracks } from '@/app/spotify/client.services';
import { useSubdomain } from '@/client/hooks/use-subdomain';
import { cn } from '@/lib/cn';
import { SimplifiedAlbum, SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';

interface AlbumTracksProps {
	album: SimplifiedAlbum;
}

export function AlbumTracks({ album }: AlbumTracksProps) {
	const { data: tracks } = useQuery({
		queryKey: ['albums', 'tracks', album.id],
		queryFn: () => clientGetAlbumTracks(album.id),
	});

	const { songs } = useSubdomain();

	const durationFormatted = (duration_ms: number) => {
		const seconds = Math.floor(duration_ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const clubAlreadyHasSong = (track: SimplifiedTrack) =>
		songs?.some((song) => song.trackId === track.id) ?? false;

	return (
		<div className='flex flex-col gap-2'>
			{tracks?.map((track) => (
				<div
					key={track.id}
					className={cn(
						'flex gap-2',
						clubAlreadyHasSong(track) && 'opacity-50 hover:cursor-not-allowed'
					)}>
					<input
						disabled={clubAlreadyHasSong(track)}
						type='checkbox'
						className='checkbox'
						name={track.name}
						value={`track_${track.id}`}
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

'use client';

import { clientGetAlbumTracks } from '@/app/api/spotify.service';
import { TrackSkeleton } from '@/components/skeletons/track-skeleton';
import { useSubdomain } from '@/hooks/use-subdomain';
import { cn, durationFormatted } from '@/util';
import { SimplifiedAlbum, SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

interface AlbumTracksProps {
	album: SimplifiedAlbum;
	setSelectedAmt: Dispatch<SetStateAction<number>>;
}

export function AlbumTracks({ album, setSelectedAmt }: AlbumTracksProps) {
	const { data: tracks, isPending } = useQuery({
		queryKey: ['albums', 'tracks', album.id],
		queryFn: () => clientGetAlbumTracks(album.id),
	});

	const { songs } = useSubdomain();

	const clubAlreadyHasSong = (track: SimplifiedTrack) =>
		songs?.some((song) => song.trackId === track.id) ?? false;

	return (
		<div className='flex flex-col gap-2'>
			{!tracks || isPending ? (
				<>
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
				</>
			) : (
				tracks.map((track) => (
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
							onChange={(e) => {
								if (e.target.checked) setSelectedAmt((prev) => prev + 1);
								else setSelectedAmt((prev) => prev - 1);
							}}
						/>
						<p className='font-thin opacity-70 min-w-4'>{track.track_number}</p>
						<p className='font-bold flex-1'>{track.name}</p>
						<p className='font-mono self-end'>
							{durationFormatted(track.duration_ms)}
						</p>
					</div>
				))
			)}
		</div>
	);
}

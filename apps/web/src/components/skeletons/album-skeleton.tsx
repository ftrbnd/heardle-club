import { TrackSkeleton } from '@/components/skeletons/track-skeleton';

export function AlbumSkeleton() {
	return (
		<div className='collapse collapse-arrow bg-base-100 border-base-300 border'>
			<input type='checkbox' />

			<div className='collapse-title font-semibold flex items-center gap-4'>
				<div className='skeleton h-12 w-12'></div>

				<div className='skeleton h-6 w-24'></div>
				<p className='opacity-70 text-xs flex-1 text-end'>0 tracks</p>
			</div>
			<div className='collapse-content text-sm'>
				<div className='flex flex-col gap-2'>
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
					<TrackSkeleton />
				</div>
			</div>
		</div>
	);
}

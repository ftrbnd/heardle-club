'use client';

import { useJobProgress } from '@/hooks/use-job-progress';
import { SelectClub } from '@repo/database/postgres/schema';

interface ClubDownloadStatusProps {
	club: SelectClub;
}

export function ClubDownloadStatus({ club }: ClubDownloadStatusProps) {
	const { status } = useJobProgress(club, 'download');

	if (!status.currentTrack || status.currentStep === status.totalTracks)
		return <></>;

	return (
		<div className='flex flex-col w-full bg-blend-soft-light'>
			<div
				role='alert'
				className='alert alert-soft alert-info'>
				<span className='loading loading-spinner loading-xs md:loading-md'></span>
				<p className='flex justify-between w-full'>
					<span>{status.percentage}%</span>
					<span className='font-bold'>
						Downloading {status.currentTrack}...
					</span>
					<span>
						{status.currentStep}/{status.totalTracks}
					</span>
				</p>
			</div>

			<progress
				className='progress progress-info w-full'
				value={status.currentStep ?? 0 + 1}
				max={status.totalTracks}></progress>
		</div>
	);
}

'use client';

import { useDownloadStatus } from '@/client/hooks/use-download-status';
import { SelectClub } from '@repo/database/postgres/schema';

interface ClubDownloadStatusProps {
	club: SelectClub;
}

export function ClubDownloadStatus({ club }: ClubDownloadStatusProps) {
	const { status } = useDownloadStatus(club);

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
					<span>Downloading {status.currentTrack}...</span>
					<span>
						{status.currentStep}/{status.totalTracks}
					</span>
				</p>
			</div>

			<progress
				className='progress progress-info w-full'
				value={status.currentTrack ?? 0 + 1}
				max={status.totalTracks}></progress>
		</div>
	);
}

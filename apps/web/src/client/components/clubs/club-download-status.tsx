'use client';

import { useDownloadStatus } from '@/client/hooks/use-download-status';
import { SelectClub } from '@repo/database/postgres/schema';

interface ClubDownloadStatusProps {
	club: SelectClub;
}

export function ClubDownloadStatus({ club }: ClubDownloadStatusProps) {
	const { status } = useDownloadStatus(club);

	if (status.current === status.total) return <></>;

	return (
		<div className='flex flex-col w-full bg-blend-soft-light'>
			<div
				role='alert'
				className='alert alert-soft alert-info'>
				<span className='loading loading-spinner loading-xs md:loading-md'></span>
				<span>
					Downloading {status.current + 1}/{status.total} tracks...
				</span>
			</div>

			<progress
				className='progress progress-info w-full'
				value={status.current + 1}
				max={status.total}></progress>
		</div>
	);
}

'use client';

import { useJobProgress } from '@/hooks/use-job-progress';
import { SelectClub } from '@repo/database/postgres/schema';

interface ClubDailyStatusProps {
	club: SelectClub;
}

export function ClubDailyStatus({ club }: ClubDailyStatusProps) {
	const { status } = useJobProgress(club, 'daily');

	if (status.percentage === 0 || status.percentage === 100) return <></>;

	return (
		<div className='flex flex-col w-full bg-blend-soft-light'>
			<div
				role='alert'
				className='alert alert-soft alert-info'>
				<span className='loading loading-spinner loading-xs md:loading-md'></span>
				<p className='flex justify-between w-full'>
					<span>{status.percentage}%</span>
					<span>{status.message}</span>
				</p>
			</div>

			<progress className='progress progress-info progress- w-full'></progress>
		</div>
	);
}

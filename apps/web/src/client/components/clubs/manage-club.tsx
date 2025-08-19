'use client';

import { customPromiseToast } from '@/client/components/toast';
import { setClubActiveStatus } from '@/server/actions/db';
import { Pause } from '@/server/components/icons/pause';
import { Play } from '@/server/components/icons/play';
import { SelectClub } from '@repo/database/postgres';

interface ManageClubProps {
	club: SelectClub;
}

export function ManageClub({ club }: ManageClubProps) {
	const setClubStatus = async (clubId: string) => {
		const newStatus = club.isActive ? 'inActive' : 'active';
		const isActive = club.isActive ? false : true;

		customPromiseToast({
			promise: setClubActiveStatus(clubId, isActive),
			loadingText: `Setting club to ${newStatus}...`,
			successText: `Set club to ${newStatus}`,
			errorText: `Failed to set club to ${newStatus}`,
		});
	};

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-2 justify-between'>
				<p>
					<span className='font-bold'>{club.displayName}</span> is currently{' '}
					<span className='font-bold'>
						{club.isActive ? 'active' : 'inactive'}.
					</span>
				</p>
				<button
					onClick={() => setClubStatus(club.id)}
					className={`btn ${club.isActive ? 'btn-secondary' : 'btn-primary'}`}>
					{club.isActive ? <Pause /> : <Play />}
					{club.isActive ? 'Pause' : 'Start'} daily Heardles
				</button>
			</div>

			<button className='btn btn-error self-end'>Delete club</button>
		</div>
	);
}

'use client';

import { leaveClub } from '@/server/actions/db';
import { LogOut } from '@/server/components/icons/log-out';
import { customToast } from '@/client/components/toast';
import { SelectClub } from '@repo/database/postgres/schema';

export function LeaveClubButton({
	userId,
	club,
}: {
	userId?: string;
	club: SelectClub;
}) {
	const handleClick = async () => {
		try {
			await leaveClub({ club, userId: userId ?? '' });

			customToast({
				type: 'success',
				message: `You left ${club.displayName}`,
			});
		} catch (err) {
			if (err && err instanceof Error) {
				customToast({
					type: 'error',
					message: err.message,
				});
			}
		}
	};

	return (
		<div
			className='tooltip tooltip-warning'
			data-tip='Leave club'>
			<button
				className='btn btn-square btn-ghost'
				onClick={handleClick}>
				<LogOut />
			</button>
		</div>
	);
}

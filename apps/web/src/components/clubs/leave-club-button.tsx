'use client';

import { leaveClub } from '@/actions/db';
import { LogOut } from '@/components/icons/log-out';
import { customToast } from '@/components/toast';
import { SelectClub } from '@repo/database/postgres';

export function LeaveClubButton({
	userId,
	club,
}: {
	userId?: string;
	club: SelectClub;
}) {
	const handleClick = async () => {
		try {
			await leaveClub(userId, club.id);

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

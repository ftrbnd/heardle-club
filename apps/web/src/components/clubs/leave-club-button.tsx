'use client';

import { leaveClub } from '@/actions/db';
import { LogOut } from '@/components/icons/log-out';
import { customToast } from '@/components/toast';

export function LeaveClubButton({
	userId,
	clubId,
}: {
	userId?: string;
	clubId: string;
}) {
	const handleClick = async () => {
		try {
			await leaveClub(userId, clubId);
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

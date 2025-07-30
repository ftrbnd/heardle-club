'use client';

import { leaveClub } from '@/actions/db';
import { LogOut } from '@/components/icons/log-out';

export function LeaveClubButton({
	userId,
	clubId,
}: {
	userId?: string;
	clubId: string;
}) {
	return (
		<div
			className='tooltip tooltip-warning'
			data-tip='Leave club'>
			<button
				className='btn btn-square btn-ghost'
				onClick={() => leaveClub(userId, clubId)}>
				<LogOut />
			</button>
		</div>
	);
}

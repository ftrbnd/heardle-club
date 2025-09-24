'use client';

import { leaveClub } from '@/app/actions/db';
import { LogOut } from '@/components/icons/log-out';
import { SelectClub } from '@repo/database/postgres/schema';
import { useToastActionState } from '@/hooks/use-toast-action-state';

export function LeaveClubButton({
	userId,
	club,
}: {
	userId?: string;
	club: SelectClub;
}) {
	const leaveWithIds = leaveClub.bind(null, {
		userId: userId ?? '',
		club,
	});
	const { formAction, actionIsPending } = useToastActionState({
		action: leaveWithIds,
		successMessage: `You left ${club.displayName}`,
	});

	return (
		<div
			className='tooltip tooltip-warning'
			data-tip='Leave club'>
			<form action={formAction}>
				<button
					type='submit'
					disabled={actionIsPending}
					className='btn btn-square btn-ghost'>
					<LogOut />
				</button>
			</form>
		</div>
	);
}

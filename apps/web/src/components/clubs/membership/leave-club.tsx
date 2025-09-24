'use client';

import { leaveClub } from '@/app/actions/db';
import { SelectClub } from '@repo/database/postgres/schema';
import { User } from '@/app/api/auth/_user';
import { ComponentProps } from 'react';
import { useToastActionState } from '@/hooks/use-toast-action-state';

interface LeaveClubProps extends ComponentProps<'form'> {
	club: SelectClub;
	user: User | null;
}

export function LeaveClub({ club, user, className, ...props }: LeaveClubProps) {
	const leaveWithIds = leaveClub.bind(null, {
		userId: user?.id ?? '',
		club,
	});
	const { formAction, actionIsPending } = useToastActionState({
		action: leaveWithIds,
		successMessage: `You left ${club.displayName}`,
	});

	return (
		<form
			action={formAction}
			className={className}
			{...props}>
			<button
				type='submit'
				disabled={!user || actionIsPending}
				className='btn btn-soft btn-error btn-block'>
				Leave {club.displayName}
			</button>
		</form>
	);
}

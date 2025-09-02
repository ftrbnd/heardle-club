'use client';

import { leaveClub } from '@/server/actions/db';
import { SelectClub } from '@repo/database/postgres';
import { customToast } from '@/client/components/toast';
import { User } from '@/app/api/auth/_user';
import { ComponentProps, useActionState, useEffect } from 'react';

interface LeaveClubProps extends ComponentProps<'form'> {
	club: SelectClub;
	user: User | null;
}

export function LeaveClub({ club, user, className, ...props }: LeaveClubProps) {
	const leaveWithIds = leaveClub.bind(null, {
		userId: user?.id,
		club,
	});
	const [state, formAction, actionIsPending] = useActionState(leaveWithIds, {
		error: undefined,
		success: false,
	});

	useEffect(() => {
		if (state.error) {
			customToast({
				message: state.error,
				type: 'error',
			});
		} else if (state.success) {
			customToast({
				message: `You left ${club.displayName}!`,
				type: 'success',
			});
		}
	}, [actionIsPending, state, club.displayName]);

	return (
		<form
			action={formAction}
			className={className}
			{...props}>
			<button
				type='submit'
				disabled={!user || actionIsPending}
				className='btn btn-error btn-block'>
				Leave {club.displayName}
			</button>
		</form>
	);
}

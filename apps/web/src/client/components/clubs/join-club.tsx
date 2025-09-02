'use client';

import { joinClub } from '@/server/actions/db';
import { SelectClub, SelectUser } from '@repo/database/postgres';
import { customToast } from '@/client/components/toast';
import { User } from '@/app/api/auth/_user';
import { useActionState, useEffect } from 'react';

interface JoinClubProps {
	club: SelectClub;
	user: User | null;
	members: SelectUser[];
}

export function JoinClub({ club, user, members }: JoinClubProps) {
	const alreadyJoined = members.some((m) => m.id === user?.id);

	const joinWithIds = joinClub.bind(null, {
		userId: user?.id,
		club,
	});
	const [state, formAction, actionIsPending] = useActionState(joinWithIds, {
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
				message: `Welcome to ${club.displayName}!`,
				type: 'success',
			});
		}
	}, [actionIsPending, state, club.displayName]);

	if (!alreadyJoined)
		return (
			<form action={formAction}>
				<button
					type='submit'
					disabled={alreadyJoined || !user || actionIsPending}
					className='btn btn-primary btn-block'>
					Join {club.displayName}
				</button>
			</form>
		);

	return <></>;
}

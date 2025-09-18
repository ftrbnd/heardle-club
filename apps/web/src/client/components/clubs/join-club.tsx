'use client';

import { joinClub } from '@/server/actions/db';
import { SelectClub } from '@repo/database/postgres/schema';
import { User } from '@/app/api/auth/_user';
import { ComponentProps } from 'react';
import { useToastActionState } from '@/client/hooks/use-toast-action-state';

interface JoinClubProps extends ComponentProps<'form'> {
	club: SelectClub;
	user: User | null;
}

export function JoinClub({ club, user, className, ...props }: JoinClubProps) {
	const joinWithIds = joinClub.bind(null, {
		userId: user?.id ?? '',
		club,
	});
	const { formAction, actionIsPending } = useToastActionState({
		action: joinWithIds,
		successMessage: `Welcome to ${club.displayName}!`,
	});

	return (
		<form
			action={formAction}
			className={className}
			{...props}>
			<button
				type='submit'
				disabled={!user || actionIsPending}
				className='btn btn-primary btn-block'>
				Join {club.displayName}
			</button>
		</form>
	);
}

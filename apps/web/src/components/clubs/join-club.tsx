'use client';

import { joinClub } from '@/actions/db';
import { User } from '@/actions/_user';
import { SelectClub, SelectUser } from '@repo/database/postgres';
import { customToast } from '@/components/toast';

interface JoinClubProps {
	club: SelectClub;
	user: User | null;
	members: SelectUser[];
}

export function JoinClub({ club, user, members }: JoinClubProps) {
	const alreadyJoined = members.some((m) => m.id === user?.id);

	const handleClick = async () => {
		try {
			await joinClub(user?.id, club.id);

			customToast({
				type: 'success',
				message: `Welcome to ${club.displayName}!`,
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
		<button
			onClick={handleClick}
			disabled={alreadyJoined || !user}
			className='btn btn-primary btn-block'>
			Join {club.displayName}
		</button>
	);
}

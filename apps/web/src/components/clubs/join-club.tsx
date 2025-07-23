'use client';

import { joinClub } from '@/actions/db';
import { User } from '@/actions/_user';
import { SelectClub, SelectUser } from '@repo/database/postgres';

interface JoinClubProps {
	club: SelectClub;
	user: User | null;
	members: SelectUser[];
}

export function JoinClub({ club, user, members }: JoinClubProps) {
	const alreadyJoined = members.some((m) => m.id === user?.id);

	const handleClick = async () => {
		// TODO: users can't join because auth session does not persist across subdomains and root domain
		const res = await joinClub(user?.id, club.id);
		console.log(res);
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

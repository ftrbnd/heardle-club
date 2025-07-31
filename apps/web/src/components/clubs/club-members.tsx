import { getCurrentUser } from '@/actions/auth';
import { JoinClub } from '@/components/clubs/join-club';
import { SelectClub, SelectUser } from '@repo/database/postgres';

interface ClubMembersProps {
	club: SelectClub;
	members: SelectUser[];
}

export async function ClubMembers({ club, members }: ClubMembersProps) {
	const user = await getCurrentUser();

	return (
		<>
			<div className='flex justify-between'>
				<h2 className='text-2xl font-bold'>Members</h2>
				<span className='text-xl'>{members.length}</span>
			</div>

			{members.length === 0 && <li className='text-xs'>No members yet.</li>}

			{members.map((member) => (
				<li key={member.id}>
					{/* {TODO: avatar} */}
					<a>{member.displayName}</a>
				</li>
			))}

			<div className='mt-6'>
				<JoinClub
					club={club}
					user={user}
					members={members}
				/>
			</div>
		</>
	);
}

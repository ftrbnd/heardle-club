import { getCurrentUser } from '@/app/api/auth/server.services';
import { JoinClub } from '@/client/components/clubs/join-club';
import { UserAvatar } from '@/server/components/account/avatar';
import { Crown } from '@/server/components/icons/crown';
import { SelectClub, SelectUser } from '@repo/database/postgres';

interface ClubMembersProps {
	club: SelectClub;
	members: SelectUser[];
}

export async function ClubMembers({ club, members }: ClubMembersProps) {
	const user = await getCurrentUser();
	const membersWithoutOwner = members.filter(
		(member) => member.id !== club.ownerId
	);
	const owner = members.find((member) => member.id === club.ownerId);

	return (
		<>
			<div className='flex justify-between'>
				<h2 className='text-2xl font-bold'>Members</h2>
				<span className='text-xl'>{members.length}</span>
			</div>

			{members.length === 0 && <li className='text-xs'>No members yet.</li>}

			{owner && (
				<ClubMember
					club={club}
					member={owner}
				/>
			)}
			{membersWithoutOwner.map((member) => (
				<ClubMember
					key={member.id}
					club={club}
					member={member}
				/>
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

function ClubMember({
	member,
	club,
}: {
	member: SelectUser;
	club: SelectClub;
}) {
	return (
		<li>
			<a className='flex'>
				<UserAvatar
					user={member}
					imageSize={24}
					className='size-6 rounded-full'
				/>
				{member.displayName}
				{member.id === club.ownerId && <Crown />}
			</a>
		</li>
	);
}

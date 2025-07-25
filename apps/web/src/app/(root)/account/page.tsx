import { getCurrentUser } from '@/actions/auth';
import { AccountDetails } from '@/components/account/details';
import { ClubsCollection } from '@/components/clubs/collection';
import { loginURL } from '@/lib/domains';
import { getJoinedClubs } from '@repo/database/api';
import { redirect } from 'next/navigation';

export default async function Page() {
	const user = await getCurrentUser();
	if (!user) return redirect(loginURL);

	const result = await getJoinedClubs(user.id);
	const clubs = result.map((res) => res.clubs).filter((club) => club !== null);

	return (
		<div className='flex-1 p-4'>
			<AccountDetails user={user} />
			<ClubsCollection
				clubs={clubs}
				title='Your Clubs'
			/>
		</div>
	);
}

import { ClubsCollection } from '@/components/clubs/collection';
import { getCurrentSession } from '@/lib/auth/session';
import { getJoinedClubs, getTrendingClubs } from '@repo/database/api';

export default async function HomePage() {
	const session = await getCurrentSession();
	const trending = await getTrendingClubs();
	const joined = await getJoinedClubs(session?.userId);
	const joinedClubs = joined.map((j) => j.clubs).filter((c) => c !== null);

	return (
		<div className='py-8 flex flex-col gap-8 items-center'>
			<ClubsCollection
				clubs={trending}
				title='Trending'
				session={session}
			/>

			<ClubsCollection
				clubs={joinedClubs}
				title='Your Clubs'
				session={session}
			/>
		</div>
	);
}

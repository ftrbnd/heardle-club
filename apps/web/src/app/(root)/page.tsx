import { getCurrentUser } from '@/actions/auth';
import { getJoinedClubs, getTrendingClubs } from '@repo/database/api';
import { ClubsCollection } from '@/components/clubs/collection';

export default async function HomePage() {
	const user = await getCurrentUser();
	const trending = await getTrendingClubs();
	const joined = await getJoinedClubs(user?.id);
	const joinedClubs = joined.map((j) => j.clubs).filter((c) => c !== null);

	return (
		<div className='py-8 px-4 flex flex-col gap-8'>
			<div className='py-8 px-4 flex flex-col gap-8'>
				<ClubsCollection
					clubs={trending}
					title='Trending'
				/>

				<ClubsCollection
					clubs={joinedClubs}
					title='Your Clubs'
				/>
			</div>
		</div>
	);
}

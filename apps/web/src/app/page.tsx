import { ClubsCollection } from '@/components/clubs/collection';
import { getCurrentSession } from '@/lib/auth/session';
import { getJoinedClubs, getTrendingClubs } from '@repo/database/api';

export default async function HomePage() {
	const session = await getCurrentSession();
	const trending = await getTrendingClubs();
	const joined = await getJoinedClubs(session?.userId);
	const joinedClubs = joined.map((j) => j.clubs).filter((c) => c !== null);

	return (
		<div>
			<ClubsCollection
				clubs={trending}
				title='Trending'
			/>

			{session ? (
				joinedClubs.length > 0 ? (
					<ClubsCollection
						clubs={joinedClubs}
						title='Your clubs'
					/>
				) : (
					<div>
						<p>You haven&apos;t joined a club yet.</p>
						<button>Search for a club</button>
					</div>
				)
			) : (
				<div>
					<p>Create an account to save your favorite clubs</p>
					<button>Sign in</button>
				</div>
			)}
		</div>
	);
}

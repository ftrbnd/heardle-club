import { getCurrentUser } from '@/app/actions/auth';
import { getJoinedClubs, getTrendingClubs } from '@repo/database/postgres/api';
import { ClubsCollection } from '@/components/clubs/public/collection';
import {
	ClubMenuItem,
	JOINED_CLUBS_DRAWER_ID,
} from '@/components/clubs/membership/club-menu-item';

export default async function HomePage() {
	const user = await getCurrentUser();
	const trending = await getTrendingClubs();
	const joined = await getJoinedClubs(user?.id);
	const joinedClubs = joined.map((j) => j.clubs).filter((c) => c !== null);

	return (
		<div className='drawer lg:drawer-open'>
			<input
				id={JOINED_CLUBS_DRAWER_ID}
				type='checkbox'
				className='drawer-toggle'
			/>
			<div className='drawer-content flex flex-col items-center justify-center'>
				{/* Page content here */}
				<ClubsCollection
					clubs={trending}
					title='Trending'
				/>
			</div>
			<div className='drawer-side z-53'>
				<label
					htmlFor={JOINED_CLUBS_DRAWER_ID}
					aria-label='close sidebar'
					className='drawer-overlay'></label>
				<ul className='menu bg-base-200 min-h-full w-80 p-4 gap-2'>
					<div className='flex justify-between'>
						<h4 className='text-2xl font-bold'>Your clubs</h4>
						<span className='text-xl'>{joinedClubs.length}</span>
					</div>
					{joinedClubs.length === 0 ? (
						<li className='badge badge-soft badge-info self-center'>
							Join a club to get started!
						</li>
					) : (
						joinedClubs.map((club) => (
							<ClubMenuItem
								key={club.id}
								club={club}
							/>
						))
					)}
				</ul>
			</div>
		</div>
	);
}

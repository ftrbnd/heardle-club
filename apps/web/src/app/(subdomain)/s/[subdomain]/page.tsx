import { getCurrentUser } from '@/app/actions/auth';
import { ClubDailyStatus } from '@/components/clubs/info/club-daily-status';
import { LeftDrawer } from '@/app/(subdomain)/s/[subdomain]/_components/left-drawer';
import { ClubNotFound } from '@/app/(subdomain)/s/[subdomain]/_components/not-found';
import { Tabs } from '@/app/(subdomain)/s/[subdomain]/_components/tabs';
import {
	getClubBySubdomain,
	getClubSongs,
	getUsersFromClub,
} from '@repo/database/postgres/api';
import Link from 'next/link';
import { StatsGrid } from '@/components/account/stats-grid';

interface PageParams {
	params: Promise<{ subdomain: string }>;
}

export default async function SubdomainPage({ params }: PageParams) {
	const { subdomain } = await params;
	const club = await getClubBySubdomain(subdomain);

	if (!club) return <ClubNotFound />;

	const members = await getUsersFromClub(club.id);

	const user = await getCurrentUser();
	const isOwner = club.ownerId === user?.id;

	const songs = await getClubSongs(club.id);

	return (
		<div className='flex-1 flex flex-col items-center'>
			<LeftDrawer
				club={club}
				members={members}>
				<ClubDailyStatus club={club} />
				<Tabs
					isOwner={isOwner}
					selectedTab='Members'
				/>

				<h2 className='text-2xl font-bold pt-2 px-6'>Your Statistics</h2>
				<StatsGrid />
				<div className='h-full flex flex-col gap-2 items-center justify-center'>
					<div
						className={`badge badge-soft ${club.isActive ? 'badge-primary' : 'badge-secondary'}`}>
						{club.isActive ? 'Active' : 'Inactive'}
					</div>
					{songs.length > 0 ? (
						club.isActive ? (
							<Link
								className='btn btn-primary'
								href='/play'
								prefetch={false}>
								Play
							</Link>
						) : (
							<button
								className='btn btn-primary'
								disabled>
								Play
							</button>
						)
					) : isOwner ? (
						<Link
							href='/dashboard'
							className='btn btn-primary'>
							Add some songs to get started.
						</Link>
					) : (
						<p>No songs have been added yet.</p>
					)}
				</div>
			</LeftDrawer>
		</div>
	);
}

import { getCurrentUser } from '@/app/api/auth/server.services';
import { LeftDrawer } from '@/server/components/subdomain/left-drawer';
import { ClubNotFound } from '@/server/components/subdomain/not-found';
import { Tabs } from '@/server/components/subdomain/tabs';
import {
	getClubBySubdomain,
	getClubSongs,
	getUsersFromClub,
} from '@repo/database/postgres/api';
import Link from 'next/link';

interface PageParams {
	params: Promise<{ subdomain: string }>;
}

export default async function SubdomainPage({ params }: PageParams) {
	const { subdomain } = await params;
	const club = await getClubBySubdomain(subdomain);

	if (!club) return <ClubNotFound />;

	const result = await getUsersFromClub(club.id);
	const members = result
		.map((res) => res.users)
		.filter((member) => member !== null);

	const user = await getCurrentUser();
	const isOwner = club.ownerId === user?.id;

	const songs = await getClubSongs(club.id);

	return (
		<div className='flex-1 flex flex-col items-center'>
			<LeftDrawer
				club={club}
				members={members}>
				<Tabs
					isOwner={isOwner}
					selectedTab='Members'
				/>
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

import { getCurrentUser } from '@/actions/auth';
import { LeftDrawer } from '@/components/subdomain/left-drawer';
import { ClubNotFound } from '@/components/subdomain/not-found';
import { Tabs } from '@/components/subdomain/tabs';
import { getClubBySubdomain, getUsersFromClub } from '@repo/database/api';

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

	return (
		<div className='flex-1 flex flex-col items-center'>
			<LeftDrawer
				club={club}
				members={members}>
				<Tabs
					isOwner={isOwner}
					selectedTab='members'
				/>
				<p className='text-xl'>Welcome to {club.displayName}</p>
			</LeftDrawer>
		</div>
	);
}

import { LEFT_DRAWER_ID, LeftDrawer } from '@/components/subdomain/left-drawer';
import { ClubNotFound } from '@/components/subdomain/not-found';
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

	return (
		<div className='flex-1 flex flex-col items-center'>
			<label
				htmlFor={LEFT_DRAWER_ID}
				className='btn drawer-button mt-2 lg:hidden'>
				Members
			</label>

			<LeftDrawer
				club={club}
				members={members}>
				<p className='text-xl'>Welcome to {club.displayName}</p>
			</LeftDrawer>
		</div>
	);
}

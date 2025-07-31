import { getCurrentUser } from '@/actions/auth';
import { ClubNotFound } from '@/components/subdomain/not-found';
import { Tabs } from '@/components/subdomain/tabs';
import { getClubBySubdomain } from '@repo/database/api';
import { redirect } from 'next/navigation';

interface PageParams {
	params: Promise<{ subdomain: string }>;
}

export default async function Page({ params }: PageParams) {
	const { subdomain } = await params;

	const club = await getClubBySubdomain(subdomain);
	if (!club) return <ClubNotFound />;

	const user = await getCurrentUser();
	const isOwner = club.ownerId === user?.id;

	if (!isOwner) return redirect('/');

	return (
		<div className='flex-1'>
			<Tabs
				isOwner={isOwner}
				selectedTab='dashboard'
			/>
			TODO: Dashboard
		</div>
	);
}

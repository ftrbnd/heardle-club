import { getCurrentUser } from '@/actions/auth';
import { SubdomainTab, Tabs } from '@/components/subdomain/tabs';
import { getClubBySubdomain } from '@repo/database/api';
import { ReactNode } from 'react';

interface PageParams {
	params: Promise<{ subdomain: string; tab: string }>;
	children: ReactNode;
}

export default async function Layout({ params, children }: PageParams) {
	const { subdomain, tab } = await params;
	const club = await getClubBySubdomain(subdomain);
	const user = await getCurrentUser();

	const subdomainTab = (tab[0].toUpperCase() +
		tab.substring(1)) as SubdomainTab;

	return (
		<div className='flex-1'>
			<Tabs
				isOwner={club?.ownerId === user?.id}
				selectedTab={subdomainTab}
			/>
			{children}
		</div>
	);
}

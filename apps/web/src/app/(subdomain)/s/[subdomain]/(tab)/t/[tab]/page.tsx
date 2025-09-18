import { getCurrentUser } from '@/app/api/auth/server.services';
import { Dashboard } from '@/app/(subdomain)/s/[subdomain]/(tab)/t/[tab]/_dashboard';
import { SubdomainTab } from '@/server/components/subdomain/tabs';
import { getClubBySubdomain } from '@repo/database/postgres/api';
import { redirect } from 'next/navigation';

interface PageParams {
	params: Promise<{ subdomain: string; tab: string }>;
}
export default async function Page({ params }: PageParams) {
	const { subdomain, tab } = await params;
	const club = await getClubBySubdomain(subdomain);
	if (!club) return redirect('/');

	const user = await getCurrentUser();
	const isOwner = club?.ownerId === user?.id;
	if (!isOwner && tab === 'dashboard') return redirect('/');

	const tabPage = (tab[0].toUpperCase() + tab.substring(1)) as SubdomainTab;

	if (tabPage === 'Dashboard') return <Dashboard club={club} />;

	return <>TODO: {tabPage}</>;
}

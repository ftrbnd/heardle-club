import { getCurrentUser } from '@/actions/auth';
import { getClubBySubdomain } from '@repo/database/api';
import { redirect } from 'next/navigation';

interface PageParams {
	params: Promise<{ subdomain: string; tab: string }>;
}
export default async function Page({ params }: PageParams) {
	const { subdomain, tab } = await params;

	const club = await getClubBySubdomain(subdomain);
	const user = await getCurrentUser();
	const isOwner = club?.ownerId === user?.id;
	if (!isOwner && tab === 'dashboard') return redirect('/');

	return <div>TODO: {tab}</div>;
}

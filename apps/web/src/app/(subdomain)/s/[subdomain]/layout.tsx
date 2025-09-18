import { Navbar } from '@/server/components/layout/navbar';
import { rootDomain } from '@/lib/domains';
import { getClubBySubdomain } from '@repo/database/postgres/api';
import { Metadata } from 'next';
import { ReactNode } from 'react';

interface PageParams {
	params: Promise<{ subdomain: string }>;
	children?: ReactNode;
}

export async function generateMetadata({
	params,
}: PageParams): Promise<Metadata> {
	const { subdomain } = await params;
	const club = await getClubBySubdomain(subdomain);

	if (!club) {
		return {
			title: rootDomain,
		};
	}

	return {
		title: `${club.displayName} - Heardle Club`,
		description: `Heardle Club for ${club.displayName}`,
	};
}

export default async function Layout({ params, children }: PageParams) {
	const { subdomain } = await params;
	const club = await getClubBySubdomain(subdomain);

	return (
		<>
			<Navbar club={club} />
			{children}
		</>
	);
}

import { Navbar } from '@/components/navbar';
import { rootDomain } from '@/lib/domains';
import { getClubBySubdomain } from '@repo/database/api';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
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

export default async function Layout({
	params,
	children,
}: {
	params: Promise<{ subdomain: string }>;
	children: ReactNode;
}) {
	const { subdomain } = await params;
	const club = await getClubBySubdomain(subdomain);

	return (
		<>
			<Navbar club={club} />
			{children}
		</>
	);
}

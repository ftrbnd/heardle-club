import { ClubMembers } from '@/components/clubs/club-members';
import { Alert } from '@/components/icons/alert';
import { rootURL } from '@/lib/domains';
import { getClubBySubdomain, getUsersFromClub } from '@repo/database/api';
import Link from 'next/link';

export default async function SubdomainPage({
	params,
}: {
	params: Promise<{ subdomain: string }>;
}) {
	const { subdomain } = await params;
	const club = await getClubBySubdomain(subdomain);

	if (!club) return <ClubNotFound />;

	const result = await getUsersFromClub(club.id);
	const members = result
		.map((res) => res.users)
		.filter((member) => member !== null);

	return (
		<div className='flex-1 flex flex-col items-center justify-center'>
			<p className='text-xl'>Welcome to {club.displayName}</p>
			<ClubMembers
				club={club}
				members={members}
			/>
		</div>
	);
}

function ClubNotFound() {
	return (
		<div className='flex-1 flex flex-col items-center justify-center w-full'>
			<div
				role='alert'
				className='alert alert-error px-16'>
				<Alert type='error' />
				<Link
					href={rootURL}
					className='link'>
					This club does not exist.
				</Link>
			</div>
		</div>
	);
}

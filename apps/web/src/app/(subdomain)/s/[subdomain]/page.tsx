import { ClubMembers } from '@/components/clubs/club-members';
import { CLIENT_URL } from '@/lib/domains';
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
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6 shrink-0 stroke-current'
					fill='none'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
				<Link
					href={CLIENT_URL}
					className='link'>
					This club does not exist.
				</Link>
			</div>
		</div>
	);
}

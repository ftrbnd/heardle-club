import { ClubMembers } from '@/components/clubs/club-members';
import { Alert } from '@/components/icons/alert';
import { rootURL } from '@/lib/domains';
import { getClubBySubdomain, getUsersFromClub } from '@repo/database/api';
import Link from 'next/link';

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
				htmlFor='my-drawer-2'
				className='btn drawer-button mt-2 lg:hidden'>
				Members
			</label>

			<div className='drawer lg:drawer-open z-51'>
				<input
					id='my-drawer-2'
					type='checkbox'
					className='drawer-toggle'
				/>
				<div className='drawer-content flex flex-col items-center justify-center'>
					{/* Page content here */}
					<p className='text-xl'>Welcome to {club.displayName}</p>
				</div>
				<div className='drawer-side'>
					<label
						htmlFor='my-drawer-2'
						aria-label='close sidebar'
						className='drawer-overlay'></label>
					<ul className='menu bg-base-200 text-base-content min-h-full w-80 p-4'>
						{/* Sidebar content here */}

						<ClubMembers
							club={club}
							members={members}
						/>
					</ul>
				</div>
			</div>
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

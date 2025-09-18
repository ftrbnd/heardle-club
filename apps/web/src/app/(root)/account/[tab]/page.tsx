import { getCurrentUser } from '@/app/api/auth/server.services';
import { AccountDetails } from '@/server/components/account/details';
import { ClubsCollection } from '@/server/components/clubs/collection';
import { loginURL } from '@/lib/domains';
import { getJoinedClubs } from '@repo/database/postgres/api';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Page({
	params,
}: {
	params: Promise<{ tab?: string }>;
}) {
	const { tab } = await params;
	if (!tab || (tab !== 'details' && tab !== 'clubs'))
		return redirect('/account/details');

	const user = await getCurrentUser();
	if (!user) return redirect(loginURL);

	const result = await getJoinedClubs(user.id);
	const clubs = result.map((res) => res.clubs).filter((club) => club !== null);

	return (
		<div className='flex-1 flex flex-col p-4'>
			<div
				role='tablist'
				className='tabs tabs-box mb-4'>
				<Link
					href='/account/details'
					role='tab'
					className={`tab ${tab === 'details' ? 'tab-active' : ''}`}>
					My account
				</Link>
				<Link
					href='/account/clubs'
					role='tab'
					className={`tab ${tab === 'clubs' ? 'tab-active' : ''}`}>
					My clubs
				</Link>
			</div>
			{tab === 'details' ? (
				<AccountDetails user={user} />
			) : (
				<ClubsCollection
					clubs={clubs}
					title='Your Clubs'
					display='list'
				/>
			)}
		</div>
	);
}

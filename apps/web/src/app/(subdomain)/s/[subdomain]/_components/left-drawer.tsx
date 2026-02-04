import { ClubMembers } from '@/components/clubs/info/club-members';
import { SelectClub, SelectUser } from '@repo/database/postgres/schema';
import { ReactNode } from 'react';

interface LeftDrawerProps {
	club: SelectClub;
	members: SelectUser[];
	children: ReactNode;
}

export const MEMBERS_DRAWER_ID = 'members_drawer' as const;

export function LeftDrawer({ club, members, children }: LeftDrawerProps) {
	return (
		<div className='h-full drawer lg:drawer-open'>
			<input
				id={MEMBERS_DRAWER_ID}
				type='checkbox'
				className='drawer-toggle'
			/>
			<div className='drawer-content'>
				{/* Page content here */}
				{children}
			</div>
			<div className='drawer-side z-53 h-full'>
				<label
					htmlFor={MEMBERS_DRAWER_ID}
					aria-label='close sidebar'
					className='drawer-overlay'></label>
				<ul className='menu bg-base-200 text-base-content w-80 h-full p-4'>
					{/* Sidebar content here */}
					<ClubMembers
						club={club}
						members={members}
					/>
				</ul>
			</div>
		</div>
	);
}

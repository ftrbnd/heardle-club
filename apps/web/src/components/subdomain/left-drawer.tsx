import { ClubMembers } from '@/components/clubs/club-members';
import { SelectClub, SelectUser } from '@repo/database/postgres';
import { ReactNode } from 'react';

interface LeftDrawerProps {
	club: SelectClub;
	members: SelectUser[];
	children: ReactNode;
}

export const LEFT_DRAWER_ID = 'members_drawer';

export function LeftDrawer({ club, members, children }: LeftDrawerProps) {
	return (
		<div className='drawer lg:drawer-open z-51'>
			<input
				id={LEFT_DRAWER_ID}
				type='checkbox'
				className='drawer-toggle'
			/>
			<div className='drawer-content'>
				{/* Page content here */}
				{children}
			</div>
			<div className='drawer-side'>
				<label
					htmlFor={LEFT_DRAWER_ID}
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
	);
}

import { LEFT_DRAWER_ID } from '@/components/subdomain/left-drawer';
import { cn } from '@/lib/cn';
import Link from 'next/link';

interface SubdomainTabsProps {
	isOwner: boolean;
	selectedTab: 'members' | 'dashboard';
}
export function Tabs({ isOwner, selectedTab }: SubdomainTabsProps) {
	return (
		<div
			role='tablist'
			className='tabs tabs-box'>
			<label
				htmlFor={LEFT_DRAWER_ID}
				role='tab'
				className={cn(
					'tab lg:hidden',
					selectedTab === 'members' && 'tab-active'
				)}>
				{selectedTab === 'members' ? 'Members' : <Link href='/'>Members</Link>}
			</label>
			{isOwner && (
				<Link
					role='tab'
					href='/dashboard'
					className={cn('tab', selectedTab === 'dashboard' && 'tab-active')}>
					Dashboard
				</Link>
			)}
		</div>
	);
}

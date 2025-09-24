import { LEFT_DRAWER_ID } from '@/app/(subdomain)/s/[subdomain]/_components/left-drawer';
import { cn } from '@/util';
import Link from 'next/link';

export const subdomainTabs = [
	'Members',
	'Dashboard',
	'Leaderboard',
	'Custom',
	'Unlimited',
] as const;

export type SubdomainTab = (typeof subdomainTabs)[number];

interface SubdomainTabsProps {
	isOwner: boolean;
	selectedTab: SubdomainTab;
}
export function Tabs({ isOwner, selectedTab }: SubdomainTabsProps) {
	return (
		<div className='overflow-x-auto'>
			<div
				role='tablist'
				className='tabs tabs-box min-w-max px-2'>
				<label
					htmlFor={LEFT_DRAWER_ID}
					role='tab'
					className={cn(
						'tab lg:hidden',
						selectedTab === 'Members' && 'tab-active'
					)}>
					{selectedTab === 'Members' ? (
						'Members'
					) : (
						<Link href='/'>Members</Link>
					)}
				</label>
				{isOwner && (
					<Tab
						name='Dashboard'
						isActive={selectedTab === 'Dashboard'}
					/>
				)}
				<Tab
					name='Leaderboard'
					isActive={selectedTab === 'Leaderboard'}
				/>
				<Tab
					name='Custom'
					isActive={selectedTab === 'Custom'}
				/>
				<Tab
					name='Unlimited'
					isActive={selectedTab === 'Unlimited'}
				/>
			</div>
		</div>
	);
}

interface TabProps {
	name: SubdomainTab;
	isActive: boolean;
}

function Tab({ name, isActive }: TabProps) {
	return (
		<Link
			role='tab'
			href={`/${name.toLowerCase()}`}
			className={cn('tab', isActive && 'tab-active')}>
			{name}
		</Link>
	);
}

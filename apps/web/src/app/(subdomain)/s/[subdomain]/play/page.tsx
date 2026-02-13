import {
	MainGame,
	PLAY_PAGE_DRAWER_ID,
} from '@/app/(subdomain)/s/[subdomain]/play/_components/main-game';
import { TodayLeaderboard } from '@/app/(subdomain)/s/[subdomain]/play/_components/today-leaderboard';

export default function Page() {
	return (
		<div className='flex-1 flex flex-col items-center'>
			<div className='h-full drawer lg:drawer-open'>
				<input
					id={PLAY_PAGE_DRAWER_ID}
					type='checkbox'
					className='drawer-toggle'
				/>
				<div className='drawer-content'>
					{/* Page content here */}

					<MainGame className='h-full' />
				</div>
				<div className='drawer-side z-53 h-full'>
					<label
						htmlFor={PLAY_PAGE_DRAWER_ID}
						aria-label='close sidebar'
						className='drawer-overlay'></label>
					<TodayLeaderboard />
				</div>
			</div>
		</div>
	);
}

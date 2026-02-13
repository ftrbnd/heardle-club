import { MainGame } from '@/app/(subdomain)/s/[subdomain]/play/_components/main-game';

const PLAY_PAGE_DRAWER_ID = 'play_page_drawer' as const;

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
					<ul className='menu bg-base-200 min-h-full w-80 p-4'>
						{/* Sidebar content here */}
						<li>
							<a>Sidebar Item 1</a>
						</li>
						<li>
							<a>Sidebar Item 2</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

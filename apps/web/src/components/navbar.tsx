import { CreateClub } from '@/components/clubs/create-club';
import { SearchClub } from '@/components/clubs/search';

export function Navbar() {
	return (
		<nav className='navbar bg-base-100 shadow-sm'>
			<div className='flex-1'>
				<h1 className='btn btn-ghost text-xl'>Heardle Club</h1>
			</div>
			<div className='flex gap-2'>
				<SearchClub />
				<CreateClub />
				<div className='dropdown dropdown-end'>
					<div
						tabIndex={0}
						role='button'
						className='btn btn-ghost btn-circle avatar'>
						<div className='w-10 rounded-full'>
							{/* TODO: Replace with user's avatar */}
							<img
								alt='Tailwind CSS Navbar component'
								src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
							/>
						</div>
					</div>
					<ul
						tabIndex={0}
						className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'>
						<li>
							<a>About</a>
						</li>
						<li>
							<a>Rules</a>
						</li>
						<li>
							<a>Account</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}

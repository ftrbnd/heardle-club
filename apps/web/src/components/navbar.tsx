import { CreateClub } from '@/components/clubs/create-club';
import { FindClub } from '@/components/clubs/find-club';
import Link from 'next/link';

export function Navbar() {
	return (
		<nav className='navbar bg-base-100 shadow-sm sticky top-0 z-50'>
			<Link
				href='/'
				className='flex-1'>
				<h1 className='btn btn-ghost text-xl'>Heardle Club</h1>
			</Link>
			<div className='flex gap-2'>
				<FindClub />
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

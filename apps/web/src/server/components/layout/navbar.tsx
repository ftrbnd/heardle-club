import { getCurrentUser } from '@/app/api/auth/server.services';
import { NavbarItems } from '@/client/components/navbar-items';
import { accountURL, loginURL } from '@/lib/domains';
import { UserAvatar } from '@/server/components/account/avatar';
import { SelectClub } from '@repo/database/postgres';
import Link from 'next/link';

export async function Navbar({ club }: { club?: SelectClub | null }) {
	const title = club ? club.displayName : 'Heardle Club';
	const user = await getCurrentUser();

	return (
		<nav className='navbar bg-base-100 shadow-sm sticky top-0 z-50'>
			<Link
				href='/'
				className='flex-1'>
				<div className='btn btn-ghost'>
					<h1 className='text-xl'>{title}</h1>
					{club && (
						<div className='badge badge-primary'>Day {club.heardleDay}</div>
					)}
				</div>
			</Link>
			<div className='flex gap-2'>
				<NavbarItems club={club} />
				<div className='dropdown dropdown-end'>
					<div
						className='btn btn-ghost '
						tabIndex={0}
						role='button'>
						{user && (
							<p className='hidden md:block md:text-lg'>{user.displayName}</p>
						)}
						<div className='avatar'>
							<div className='w-10 rounded-full'>
								<UserAvatar user={user} />
							</div>
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
							{user ? (
								<Link href={accountURL}>My account</Link>
							) : (
								<Link href={loginURL}>Log in</Link>
							)}
						</li>
						{user && (
							<li>
								<Link
									href='/logout'
									prefetch={false}>
									Log out
								</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

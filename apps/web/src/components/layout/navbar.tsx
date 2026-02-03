import { getCurrentUser } from '@/app/actions/auth';
import { getArtist } from '@/app/actions/spotify';
import { NavbarItems } from '@/components/layout/navbar-items';
import { cn } from '@/util';
import { accountURL, loginURL } from '@/util/domains';
import { UserAvatar } from '@/components/account/avatar';
import { SelectClub } from '@repo/database/postgres/schema';
import Link from 'next/link';
import { CSSProperties } from 'react';
import { Menu } from '@/components/icons/menu';

export async function Navbar({ club }: { club?: SelectClub | null }) {
	const title = club ? club.displayName : 'Heardle Club';
	const user = await getCurrentUser();
	const artist = club?.artistId ? await getArtist(club.artistId) : null;
	const artistImageUrl = artist?.images.find((image) => image.url)?.url;

	return (
		<nav
			style={
				{
					'--dynamic-bg-url': artistImageUrl ? `url(${artistImageUrl}` : '',
				} as CSSProperties
			}
			className={cn(
				artistImageUrl
					? `bg-[image:var(--dynamic-bg-url)] bg-cover bg-center`
					: 'bg-base-100'
			)}>
			<div className='navbar shadow-sm sticky top-0 z-52 backdrop-blur-md bg-base-100/60'>
				<label
					htmlFor='joined-clubs-drawer'
					aria-label='open sidebar'
					className='btn btn-square btn-ghost lg:hidden'>
					<Menu />
				</label>

				<Link
					href='/'
					className='flex-1'>
					<div className='btn btn-ghost px-0 md:px-4'>
						<h1 className='text-lg md:text-xl line-clamp-1 text-start'>
							{title}
						</h1>
						{club && (
							<div className='badge badge-primary badge-xs md:badge-md'>
								Day {club.heardleDay}
							</div>
						)}
					</div>
				</Link>
				<div className='flex gap-2'>
					<NavbarItems club={club} />
					<div className='dropdown dropdown-end'>
						<div
							className='btn btn-ghost btn-xs md:btn-md'
							tabIndex={0}
							role='button'>
							{user && (
								<p className='hidden md:block md:text-lg'>{user.displayName}</p>
							)}
							<div className='avatar'>
								<UserAvatar
									user={user}
									imageSize={32}
									className='size-8 rounded-full'
								/>
							</div>
						</div>

						<ul
							tabIndex={0}
							className='menu menu-sm dropdown-content bg-base-100 rounded-box z-52 mt-3 w-52 p-2 shadow'>
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
			</div>
		</nav>
	);
}

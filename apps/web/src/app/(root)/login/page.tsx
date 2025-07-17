import { getCurrentUser } from '@/actions/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AUTH_URL } from '@/lib/auth';

export default async function Page() {
	const user = await getCurrentUser();
	if (user) return redirect('/');

	return (
		<div className='flex-1 flex flex-col justify-center items-center'>
			<div className='card bg-base-100 w-96 shadow-sm'>
				<div className='card-body items-center text-center'>
					<h2 className='card-title'>Sign In</h2>
					<Link
						className='btn btn-primary'
						href={`${AUTH_URL}/login/spotify`}
						prefetch={false}>
						Sign in with Spotify
					</Link>
					<Link
						className='btn btn-secondary'
						href={`${AUTH_URL}/login/discord`}
						prefetch={false}>
						Sign in with Discord
					</Link>
					<div className='card-actions'>
						<Link
							className='btn btn-link'
							href='/'>
							Go back
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

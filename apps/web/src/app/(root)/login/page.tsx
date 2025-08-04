import { getCurrentUser } from '@/server/actions/auth';
import { authURL } from '@/lib/domains';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Page() {
	const user = await getCurrentUser();
	if (user) return redirect('/');

	return (
		<div className='flex-1 flex flex-col justify-center items-center'>
			<div className='card bg-base-100 w-96 shadow-sm'>
				<div className='card-body items-center text-center'>
					<h2 className='card-title'>Welcome to Heardle Club!</h2>
					<Link
						className='btn btn-primary'
						href={`${authURL}/login/spotify`}
						prefetch={false}>
						Sign in with Spotify
					</Link>
					<Link
						className='btn btn-secondary'
						href={`${authURL}/login/discord`}
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

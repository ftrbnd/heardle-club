import Link from 'next/link';
import { protocol, rootDomain } from '@/lib/utils';
import { getAllSubdomains } from '@/lib/subdomains';
import {
	deleteSession,
	deleteSessionTokenCookie,
	getCurrentSession,
} from '@/lib/auth/session';
import { redirect } from 'next/navigation';

async function logout() {
	'use server';
	const session = await getCurrentSession();
	if (!session) {
		return {
			error: 'Unauthorized',
		};
	}

	await deleteSession(session.id);
	await deleteSessionTokenCookie();
	return redirect('/login');
}

export default async function HomePage() {
	const subdomains = await getAllSubdomains();
	const session = await getCurrentSession();

	return (
		<div className='flex min-h-screen flex-col items-center justify-center relative'>
			<div className='w-full max-w-md space-y-8'>
				<div className='text-center'>
					<h1 className='text-4xl font-bold tracking-tight'>{rootDomain}</h1>
					<p className='mt-3 text-lg'>Create your own Club</p>
					{session ? (
						<div>
							<p>Session ID: {session.id}</p>
							<button onClick={logout}>Log out</button>
						</div>
					) : (
						<Link href='/login'>Log in</Link>
					)}
				</div>

				<div className='mt-8 shadow-md rounded-lg p-6'>
					<h2 className='text-2xl font-bold tracking-tight'>Active Clubs</h2>
					<ul>
						{subdomains.map(({ subdomain, name }) => (
							<Link
								prefetch={false}
								className='underline'
								key={subdomain}
								href={`${protocol}://${subdomain}.${rootDomain}`}>
								{name}
							</Link>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

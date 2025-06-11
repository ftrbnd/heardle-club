import { getCurrentSession } from '@/lib/auth/session';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Page() {
	const session = await getCurrentSession();
	if (session) return redirect('/');

	return (
		<>
			<h1>Sign in</h1>
			<Link href='/login/spotify'>Sign in with Spotify</Link>
			<Link href='/login/discord'>Sign in with Discord</Link>
		</>
	);
}

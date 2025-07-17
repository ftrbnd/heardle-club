import { getCurrentUser } from '@/actions/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AUTH_URL } from '@/lib/auth';

export default async function Page() {
	const user = await getCurrentUser();
	if (user) return redirect('/');

	return (
		<>
			<h1>Sign in</h1>
			<Link href={`${AUTH_URL}/login/spotify`}>Sign in with Spotify</Link>
			<Link href={`${AUTH_URL}/login/discord`}>Sign in with Discord</Link>
		</>
	);
}

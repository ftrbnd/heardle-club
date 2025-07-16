import Link from 'next/link';

export default async function Page() {
	return (
		<>
			<h1>Sign in</h1>
			<Link href='/login/spotify'>Sign in with Spotify</Link>
			<Link href='/login/discord'>Sign in with Discord</Link>
		</>
	);
}

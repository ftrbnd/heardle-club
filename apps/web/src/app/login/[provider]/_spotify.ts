import {
	createSession,
	generateSecureRandomString,
	setSessionTokenCookie,
} from '@/lib/auth/session';
import { spotify } from '@/lib/auth/spotify';
import { insertUser, getUserFromSpotifyId } from '@repo/database/api';
import { generateState, OAuth2Tokens } from 'arctic';
import { cookies } from 'next/headers';

const STATE_COOKIE = 'spotify_oauth_state' as const;

export async function createAuthorizationURL() {
	const state = generateState();
	const scopes: string[] = ['user-read-private', 'user-read-email'];
	const url = spotify.createAuthorizationURL(state, null, scopes);

	const cookieStore = await cookies();
	cookieStore.set(STATE_COOKIE, state, {
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}

export async function validateCallback(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const cookieStore = await cookies();
	const storedState = cookieStore.get(STATE_COOKIE)?.value ?? null;

	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await spotify.validateAuthorizationCode(code, null);
	} catch {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}

	const spotifyUserResponse = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`,
		},
	});
	const spotifyUser = await spotifyUserResponse.json();

	const existingUser = await getUserFromSpotifyId(spotifyUser.id);
	if (existingUser) {
		const session = await createSession(existingUser.id);
		await setSessionTokenCookie(session.token, session.lastVerifiedAt);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	}

	const userId = generateSecureRandomString();
	const { user } = await insertUser(
		{
			id: userId,
			email: spotifyUser.email,
		},
		{
			id: generateSecureRandomString(),
			provider: 'spotify',
			providerUserId: spotifyUser.id,
			userId,
		}
	);

	const session = await createSession(user.id);
	await setSessionTokenCookie(session.token, session.lastVerifiedAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
		},
	});
}

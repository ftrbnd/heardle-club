import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from '@/lib/auth/session';
import { spotify } from '@/lib/auth/spotify';
import { insertUser, getUserFromSpotifyId } from '@repo/database/api';
import { generateState, OAuth2Tokens } from 'arctic';
import { cookies } from 'next/headers';

export async function createAuthorizationURL() {
	const state = generateState();
	const scopes: string[] = [];
	const url = spotify.createAuthorizationURL(state, null, scopes);

	const cookieStore = await cookies();
	cookieStore.set('spotify_oauth_state', state, {
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
	const storedState = cookieStore.get('spotify_oauth_state')?.value ?? null;
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
		await setSessionTokenCookie(session.token, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	}

	const { id, token } = generateSessionToken();

	const user = await insertUser({
		id,
		email: spotifyUser.email,
	});

	const session = await createSession(user.id);
	await setSessionTokenCookie(token, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
		},
	});
}

import {
	createSession,
	generateSecureRandomString,
	setSessionTokenCookie,
} from '@/lib/auth/session';
import {
	getAuthorizationURL,
	getProviderCookie,
	getProviderEndpoint,
	getTokens,
	OAuthProvider,
} from '@/lib/auth/providers';
import {
	insertUser,
	getUserByEmail,
	addOAuthAccount,
} from '@repo/database/api';
import { generateState, OAuth2Tokens } from 'arctic';
import { cookies } from 'next/headers';

export async function createAuthorizationURL(provider: OAuthProvider) {
	const state = generateState();
	const url = getAuthorizationURL(provider, state);

	const cookieStore = await cookies();
	cookieStore.set(getProviderCookie(provider), state, {
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

export async function validateCallback(
	request: Request,
	provider: OAuthProvider
) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const cookieStore = await cookies();
	const storedState =
		cookieStore.get(getProviderCookie(provider))?.value ?? null;

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
		tokens = await getTokens(provider, code, null);
	} catch {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}

	const providerUserResponse = await fetch(getProviderEndpoint(provider), {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`,
		},
	});
	const providerUserDetails = await providerUserResponse.json();

	const existingUser = await getUserByEmail(providerUserDetails.email);
	if (existingUser) {
		const session = await createSession(existingUser.id);
		await addOAuthAccount({
			id: generateSecureRandomString(),
			provider,
			providerUserId: providerUserDetails.id,
			userId: existingUser.id,
		});
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
			email: providerUserDetails.email,
		},
		{
			id: generateSecureRandomString(),
			provider,
			providerUserId: providerUserDetails.id,
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

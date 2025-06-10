// https://lucia-auth.com/sessions/basic

import {
	insertSession,
	selectSession,
	deleteSession as deleteSessionFromDb,
} from '@repo/database/api';
import { InsertSession } from '@repo/database/postgres';
import { cookies } from 'next/headers';

interface SessionWithToken extends InsertSession {
	token: string;
}

export type OAuthProviders = 'spotify' | 'discord' | 'reddit' | 'twitter';

export function generateSecureRandomString(): string {
	const alphabet = 'abcdefghijklmnpqrstuvwxyz23456789';

	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = '';
	for (let i = 0; i < bytes.length; i++) {
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export function generateSessionToken() {
	const id = generateSecureRandomString();
	const secret = generateSecureRandomString();

	return { id, secret, token: `${id}.${secret}` };
}

export async function createSession(userId: string): Promise<SessionWithToken> {
	const now = new Date();

	const { id, secret, token } = generateSessionToken();
	const secretHash = await hashSecret(secret);

	const session: SessionWithToken = {
		id,
		userId,
		secretHash: secretHash.toString(),
		createdAt: now,
		expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
		token,
	};

	await insertSession(session);

	return session;
}

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
	const cookieStore = await cookies();

	const maxAge = Math.max(
		0,
		Math.floor((expiresAt.getTime() - Date.now()) / 1000)
	);

	cookieStore.set('session_token', token, {
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge,
		sameSite: 'lax',
	});
}

export async function validateSessionToken(token: string) {
	const tokenParts = token.split('.');
	if (tokenParts.length != 2) {
		return null;
	}
	const sessionId = tokenParts[0];
	const sessionSecret = tokenParts[1];

	const session = await getSession(sessionId);
	if (!session) return null;

	const tokenSecretHash = await hashSecret(sessionSecret);
	const sessionSecretHash = await hashSecret(session.secretHash);
	const validSecret = constantTimeEqual(tokenSecretHash, sessionSecretHash);
	if (!validSecret) {
		return null;
	}

	return session;
}

const sessionExpiresInSeconds = 60 * 60 * 24; // 1 day

async function getSession(sessionId: string) {
	const now = new Date();

	const session = await selectSession(sessionId);

	// Check expiration
	if (
		now.getTime() - session.createdAt.getTime() >=
		sessionExpiresInSeconds * 1000
	) {
		await deleteSession(sessionId);
		return null;
	}

	return session;
}

async function deleteSession(sessionId: string): Promise<void> {
	await deleteSessionFromDb(sessionId);
}

async function hashSecret(secret: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
	return new Uint8Array(secretHashBuffer);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}

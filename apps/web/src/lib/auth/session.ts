// https://lucia-auth.com/sessions/basic

import {
	insertSession,
	selectSession,
	deleteSession as deleteSessionFromDb,
	updateSession,
} from '@repo/database/api';
import { InsertSession } from '@repo/database/postgres';
import { cookies } from 'next/headers';
import { cache } from 'react';

interface SessionWithToken extends InsertSession {
	token: string;
}

const inactivityTimeoutSeconds = 60 * 60 * 24 * 10; // 10 days
const activityCheckIntervalSeconds = 60 * 60; // 1 hour
const SESSION_TOKEN_COOKIE = 'session_token' as const;

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
		secretHash,
		lastVerifiedAt: now,
		createdAt: now,
		token,
	};

	await insertSession(session);

	return session;
}

export async function setSessionTokenCookie(
	token: string,
	lastVerifiedAt: Date
) {
	const cookieStore = await cookies();

	const expiresAt = new Date(
		lastVerifiedAt.getTime() + inactivityTimeoutSeconds * 1000
	);

	cookieStore.set(SESSION_TOKEN_COOKIE, token, {
		httpOnly: true,
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		expires: expiresAt,
	});
}

export async function deleteSessionTokenCookie() {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_TOKEN_COOKIE);
}

export async function validateSessionToken(token: string) {
	const now = new Date();

	const tokenParts = token.split('.');
	if (tokenParts.length != 2) {
		return null;
	}
	const sessionId = tokenParts[0];
	const sessionSecret = tokenParts[1];

	const session = await getSession(sessionId);
	if (!session) return null;

	const tokenSecretHash = await hashSecret(sessionSecret);
	const isValidSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
	if (!isValidSecret) {
		return null;
	}

	if (
		now.getTime() - session.lastVerifiedAt.getTime() >=
		activityCheckIntervalSeconds * 1000
	) {
		session.lastVerifiedAt = now;
		const updatedTime = Math.floor(session.lastVerifiedAt.getTime() / 1000);
		await updateSession(sessionId, new Date(updatedTime));
	}

	return session;
}

async function getSession(sessionId: string) {
	const now = new Date();
	const session = await selectSession(sessionId);

	// Inactivity timeout
	if (
		now.getTime() - session.lastVerifiedAt.getTime() >=
		inactivityTimeoutSeconds * 1000
	) {
		await deleteSession(sessionId);
		return null;
	}

	return session;
}

export const getCurrentSession = cache(async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value ?? null;
	if (token === null) {
		return null;
	}
	const result = await validateSessionToken(token);
	return result;
});

export async function deleteSession(sessionId: string): Promise<void> {
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

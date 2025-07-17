'use server';

import { AUTH_URL, User, userSchema } from '@/lib/auth';
import { cookies } from 'next/headers';

const SESSION_TOKEN_COOKIE = 'session_token';

export const getSessionToken = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;

	return token;
};

export const getCurrentUser = async (): Promise<User | null> => {
	const token = await getSessionToken();
	if (!token) return null;

	const res = await fetch(`${AUTH_URL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			tags: ['user'],
		},
	});
	if (!res.ok) throw new Error('Failed to get current user');

	const data = await res.json();
	const user = userSchema.parse(data.user);

	return user;
};

export const logoutUser = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;
	console.log({ token });

	const res = await fetch(`${AUTH_URL}/logout`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	console.log(res);
	if (!res.ok) throw new Error('Failed to log out');

	cookieStore.delete(SESSION_TOKEN_COOKIE);
};

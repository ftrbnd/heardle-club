import { User, userSchema } from '@/app/api/auth/_user';
import { authURL } from '@/lib/domains';
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

	const res = await fetch(`${authURL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			tags: ['user'],
		},
	});
	if (!res.ok) return null;

	const data = await res.json();
	const user = userSchema.parse(data.user);

	return user;
};

export const logoutUser = async () => {
	const token = await getSessionToken();
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_TOKEN_COOKIE);

	const res = await fetch(`${authURL}/logout`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error('Failed to log out');
};

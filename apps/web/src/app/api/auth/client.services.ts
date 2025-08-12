import { User } from '@/app/api/auth/_user';

async function authFetch<T>(endpoint: string) {
	const res = await fetch(`/api/auth${endpoint}`);
	if (!res.ok) throw new Error(res.statusText);
	const data: T = await res.json();
	return data;
}

export async function clientGetCurrentUser() {
	const user = await authFetch<User | null>('/me');
	return user;
}

export async function clientLogoutUser() {
	await authFetch<void>('/logout');
}

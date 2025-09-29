import { User } from '@/app/actions/_user';
import { Guess } from '@repo/database/redis/schema';

async function userFetch<T>(endpoint: string, init?: RequestInit) {
	const res = await fetch(`/api/users${endpoint}`, init);
	const data = await res.json();
	if (data.error) throw new Error(data.error);
	if (!res.ok) throw new Error(res.statusText);

	return data as T;
}

export async function getUser() {
	const res = await userFetch<User | null>(`/me`);
	return res;
}

export async function getUserGuesses(userId?: string, clubId?: string) {
	if (!userId || !clubId) throw new Error('User and Club IDs are required');

	const res = await userFetch<Guess[]>(`/${userId}/guesses/${clubId}`);
	return res;
}

export async function submitUserGuess(
	guess: Guess,
	userId?: string,
	clubId?: string
) {
	if (!userId || !clubId) throw new Error('User and Club IDs are required');

	const res = await userFetch<Guess[]>(`/${userId}/guesses/${clubId}`, {
		method: 'PATCH',
		body: JSON.stringify(guess),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return res;
}

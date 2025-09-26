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

export async function getUserGuesses(clubId?: string) {
	if (!clubId) throw new Error('Club ID required');

	const res = await userFetch<Guess[]>(`/me/guesses?clubId=${clubId}`);
	return res;
}

export async function submitUserGuess(guess: Guess, clubId?: string) {
	if (!clubId) throw new Error('Club ID required');

	const res = await userFetch<Guess[]>(`/me/guesses?clubId=${clubId}`, {
		method: 'PATCH',
		body: JSON.stringify(guess),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return res;
}

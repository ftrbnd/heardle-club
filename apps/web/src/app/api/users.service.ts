import { User } from '@/app/actions/_user';
import { SelectStatistics } from '@repo/database/postgres/schema';
import { Guess } from '@repo/database/redis/schema';

async function userFetch<T>(endpoint: string, init?: RequestInit) {
	const res = await fetch(`/api/users${endpoint}`, init);
	const data = await res.json();
	if (data.error) throw new Error(data.error);
	if (!res.ok) throw new Error(res.statusText);

	return data as T;
}

function checkIDs(userId?: string, clubId?: string) {
	if (!userId || !clubId) throw new Error('User and Club IDs are required');

	return { user: userId, club: clubId };
}

export async function getUser() {
	const res = await userFetch<User | null>(`/me`);
	return res;
}

export async function getUserGuesses(userId?: string, clubId?: string) {
	const { user, club } = checkIDs(userId, clubId);

	const res = await userFetch<Guess[]>(`/${user}/guesses/${club}`);
	return res;
}

export async function submitUserGuess(
	guess: Guess,
	userId?: string,
	clubId?: string
) {
	const { user, club } = checkIDs(userId, clubId);

	const res = await userFetch<Guess[]>(`/${user}/guesses/${club}`, {
		method: 'PATCH',
		body: JSON.stringify(guess),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return res;
}

export async function getUserStatistics(userId?: string, clubId?: string) {
	const { user, club } = checkIDs(userId, clubId);

	const res = await userFetch<SelectStatistics>(`/${user}/statistics/${club}`);
	return res;
}

export async function setUserStatistics(
	userId?: string,
	clubId?: string,
	guesses?: Guess[]
) {
	const { user, club } = checkIDs(userId, clubId);

	const res = await userFetch<SelectStatistics>(`/${user}/statistics/${club}`, {
		method: 'PATCH',
		body: JSON.stringify({ guesses }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return res;
}

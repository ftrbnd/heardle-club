import { ClubGuessesResult } from '@/app/api/clubs/[id]/guesses/route';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres/schema';

async function clubFetch<T>(endpoint: string) {
	const res = await fetch(`/api/clubs${endpoint}`);
	if (!res.ok) throw new Error(res.statusText);
	const data: T = await res.json();
	return data;
}

export async function searchClubs(query: string) {
	const results = await clubFetch<SelectClub[]>(`?search=${query}`);
	return results;
}

export async function getClubSongs(clubId?: string) {
	if (!clubId) throw new Error('Club ID required');

	const songs = await clubFetch<SelectBaseSong[]>(`/${clubId}/songs`);
	return songs;
}

export async function getClubGuesses(clubId?: string) {
	if (!clubId) throw new Error('Club ID required');

	const guesses = await clubFetch<ClubGuessesResult>(`/${clubId}/guesses`);
	return guesses;
}

export async function getClubBySubdomain(subdomain: string | null) {
	if (!subdomain) throw new Error('Subdomain required');

	const club = await clubFetch<SelectClub>(`?subdomain=${subdomain}`);
	return club;
}

export async function getClubDailySong(clubId?: string) {
	if (!clubId) return null;

	const daily = await clubFetch<{ song: SelectBaseSong; url: string }>(
		`/${clubId}/songs/daily`,
	);
	return daily;
}

import { SelectBaseSong, SelectClub } from '@repo/database/postgres/schema';

async function clubFetch<T>(endpoint: string) {
	const res = await fetch(`/api/clubs${endpoint}`);
	if (!res.ok) throw new Error(res.statusText);
	const data: T = await res.json();
	return data;
}

export async function clientSearchClubs(query: string) {
	const results = await clubFetch<SelectClub[]>(`?search=${query}`);
	return results;
}

export async function clientGetClubSongs(clubId?: string) {
	if (!clubId) return [];

	const songs = await clubFetch<SelectBaseSong[]>(`/${clubId}/songs`);
	return songs;
}

export async function clientGetClubBySubdomain(subdomain: string) {
	const club = await clubFetch<SelectClub>(`?subdomain=${subdomain}`);
	return club;
}

export async function clientGetClubDailySong(clubId?: string) {
	if (!clubId) return null;

	const daily = await clubFetch<{ song: SelectBaseSong; url: string }>(
		`/${clubId}/songs/daily`
	);
	return daily;
}

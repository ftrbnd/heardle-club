import { SelectBaseSong, SelectClub } from '@repo/database/postgres';

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

export async function clientGetClubDownloadStatus(clubId: string) {
	const status = await clubFetch<string>(`/${clubId}/status`);
	return status;
}

export async function clientGetClubBySubdomain(subdomain: string) {
	const club = await clubFetch<SelectClub>(`?subdomain=${subdomain}`);
	return club;
}

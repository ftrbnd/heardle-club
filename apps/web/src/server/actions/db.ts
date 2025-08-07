'use server';

import { getSubdomainURL } from '@/lib/domains';
import {
	addUserToClub,
	getClubBySubdomain,
	getClubSongs,
	getDownloadStatus,
	insertClub,
	removeUserFromClub,
	searchClubs,
} from '@repo/database/api';
import {
	insertClubSchema,
	generateSecureRandomString,
} from '@repo/database/postgres';
import { redirect } from 'next/navigation';

export async function searchForClubs(query: string) {
	const res = await searchClubs(query);
	return res;
}

interface FormIds {
	artistId: string;
	ownerId?: string;
}

export async function createClub(
	{ artistId, ownerId }: FormIds,
	formData: FormData
) {
	const rawFormData = {
		subdomain: formData.get('subdomain'),
		displayName: formData.get('displayName'),
		// TODO: support image uploading
		//  imageURL: formData.get('image'),
		id: generateSecureRandomString(),
		artistId,
		ownerId,
	};

	const validatedFields = insertClubSchema.parse(rawFormData);
	const newClub = await insertClub(validatedFields);

	const subdomain = getSubdomainURL(newClub.subdomain);
	redirect(subdomain);
}

export async function joinClub(userId?: string, clubId?: string) {
	if (!userId || !clubId) return null;

	const result = await addUserToClub(userId, clubId);
	return result;
}

export async function leaveClub(userId?: string, clubId?: string) {
	if (!userId || !clubId) return null;

	await removeUserFromClub(userId, clubId);
}

export async function getClubDownloadStatus(clubId: string) {
	const status = await getDownloadStatus(clubId);
	return status;
}

export async function findClubBySubdomain(subdomain: string) {
	const club = await getClubBySubdomain(subdomain);
	return club;
}

export async function findClubSongs(clubId?: string) {
	if (!clubId) return [];

	const songs = await getClubSongs(clubId);
	return songs;
}

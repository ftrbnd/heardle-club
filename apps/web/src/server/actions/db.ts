'use server';

import { getCurrentUser } from '@/app/api/auth/server.services';
import { getSubdomainURL } from '@/lib/domains';
import {
	addUserToClub,
	deleteClub,
	getClubById,
	insertClub,
	removeUserFromClub,
	updateClubActiveStatus,
} from '@repo/database/api';
import {
	insertClubSchema,
	generateSecureRandomString,
} from '@repo/database/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

export async function setClubActiveStatus(clubId: string, isActive: boolean) {
	const club = await getClubById(clubId);
	const user = await getCurrentUser();
	if (club?.ownerId !== user?.id) return null;

	const newClub = await updateClubActiveStatus(clubId, isActive);

	revalidatePath(`/s/${newClub.subdomain}`);
	return newClub;
}

export async function removeClub(clubId: string) {
	const club = await getClubById(clubId);
	if (!club) return null;
	const user = await getCurrentUser();
	if (!user) return null;
	if (club.ownerId !== user.id) return null;

	await deleteClub(clubId);
	revalidatePath(`/s/${club.subdomain}`);
}

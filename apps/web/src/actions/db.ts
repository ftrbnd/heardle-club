'use server';

import { protocol, rootDomain } from '@/lib/utils';
import { insertClub, searchClubs } from '@repo/database/api';
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

	redirect(`${protocol}://${newClub.subdomain}.${rootDomain}`);
}

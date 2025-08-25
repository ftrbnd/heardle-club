'use server';

import { getCurrentUser } from '@/app/api/auth/server.services';
import { getSubdomainURL } from '@/lib/domains';
import {
	addUserToClub,
	deleteClub,
	getClubById,
	insertClub,
	insertClubSong,
	removeUserAvatars,
	removeUserFromClub,
	updateClubActiveStatus,
	updateUser,
	uploadCustomClubSongFile,
	uploadUserAvatar,
} from '@repo/database/api';
import {
	insertClubSchema,
	generateSecureRandomString,
	insertBaseSongSchema,
} from '@repo/database/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type ActionState = {
	error?: string;
	success?: boolean;
};

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

export async function updateAccountDetails(
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	const user = await getCurrentUser();
	if (!user)
		return {
			error: 'Unauthorized',
		};

	const rawFormData = {
		displayName: formData.get('displayName'),
		avatar: formData.get('avatar'),
	};

	if (
		rawFormData.displayName &&
		typeof rawFormData.displayName === 'string' &&
		rawFormData.displayName !== '' &&
		rawFormData.displayName !== user.displayName
	) {
		await updateUser(user.id, {
			displayName: rawFormData.displayName,
		});
	}

	if (
		rawFormData.avatar &&
		rawFormData.avatar instanceof File &&
		rawFormData.avatar.size > 0
	) {
		if (
			rawFormData.avatar.type !== 'image/png' &&
			rawFormData.avatar.type !== 'image/jpeg'
		) {
			return {
				error: 'Upload either a PNG or JPEG image',
			};
		}

		try {
			await removeUserAvatars(user.id);
			const { publicUrl } = await uploadUserAvatar(user.id, rawFormData.avatar);
			await updateUser(user.id, {
				imageURL: publicUrl,
			});
		} catch (error) {
			if (error instanceof Error) {
				return {
					error: error.message,
				};
			}
		}
	}

	revalidatePath('/account/details');

	return {
		success: true,
	};
}

export async function deleteUserAvatar(): Promise<ActionState> {
	const user = await getCurrentUser();
	if (!user)
		return {
			error: 'Unauthorized',
		};

	await removeUserAvatars(user.id);
	await updateUser(user.id, {
		imageURL: null,
	});

	revalidatePath('/account/details');

	return { success: true };
}

export async function uploadSongFiles(
	clubId: string,
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	if (!formData)
		return {
			error: 'Submit at least one song.',
		};

	const user = await getCurrentUser();
	if (!user)
		return {
			error: 'Unauthorized',
		};

	const club = await getClubById(clubId);

	const rawFormData = {
		title: formData.get('title'),
		artist: formData.get('artist'),
		album: formData.get('album'),
		audioFile: formData.get('audio_file'),
	};
	console.log(rawFormData);

	const { data: songDetails, error } = insertBaseSongSchema
		.pick({
			title: true,
			artist: true,
			album: true,
		})
		.safeParse({
			title: rawFormData.title || null,
			artist: [rawFormData.artist || null],
			album: rawFormData.album || null,
		});
	if (error)
		return {
			error: 'Provide valid song details.',
		};

	// UPLOAD FILE TO SUPABASE
	if (
		rawFormData.audioFile &&
		rawFormData.audioFile instanceof File &&
		rawFormData.audioFile.size > 0
	) {
		if (
			rawFormData.audioFile.type !== 'audio/mpeg' &&
			rawFormData.audioFile.type !== 'audio/mp3'
		) {
			return {
				error: 'Only MP3 files are allowed.',
			};
		}

		try {
			const fileName = `${sanitizeString(songDetails.title)}.mp3`;
			const { publicUrl } = await uploadCustomClubSongFile(
				rawFormData.audioFile,
				clubId,
				fileName
			);
			// TODO: GET DURATION
			const duration = 0;

			await insertClubSong({
				id: generateSecureRandomString(),
				clubId,
				title: songDetails.title,
				artist: songDetails.artist,
				album: songDetails.album,
				audio: publicUrl,
				duration,
				source: 'file_upload',
			});
		} catch (error) {
			if (error instanceof Error)
				return {
					error: error.message,
				};
		}
	}

	revalidatePath(`/s/${club?.subdomain}`);

	return {
		success: true,
	};
}

function sanitizeString(str: string) {
	return str
		.replaceAll('/', '_')
		.replaceAll(' ', '_')
		.replaceAll(/\W/g, '')
		.toLowerCase();
}

'use server';

import { getCurrentUser } from '@/app/api/auth/server.services';
import { getSubdomainURL } from '@/lib/domains';
import { createServerAction } from '@/server/actions/create-server-action';
import {
	updateAccountSchema,
	uploadSongSchema,
} from '@/server/actions/form-data';
import {
	addUserToClub,
	deleteClub,
	deleteClubSong,
	getClubById,
	insertClub,
	insertClubSong,
	removeClubSongFile,
	removeUserAvatars,
	removeUserFromClub,
	updateClubActiveStatus,
	updateClubSongAudio,
	updateClubSongDuration,
	updateUser,
	uploadCustomClubSongFile,
	uploadUserAvatar,
	upsertSongFile,
} from '@repo/database/api';
import {
	insertClubSchema,
	generateSecureRandomString,
	insertBaseSongSchema,
	SelectBaseSong,
	sanitizeString,
	SelectClub,
} from '@repo/database/postgres';
import { redirect } from 'next/navigation';
import { z } from 'zod/v4';

type ActionState = {
	error?: string;
	success?: boolean;
};

export async function createClub(
	artistId: string,
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { artistId },
		validationFn: async (data) => {
			if (!data) throw new Error('Artist ID is required');

			const user = await getCurrentUser();
			if (!user) return { error: 'Unauthorized' };

			const rawFormData = {
				id: generateSecureRandomString(),
				artistId: data.artistId,
				ownerId: user.id,
				subdomain: formData.get('subdomain'),
				displayName: formData.get('displayName'),
				// TODO: support image uploading
				//  imageURL: formData.get('image'),
			};

			const { data: clubData, error } = insertClubSchema.safeParse(rawFormData);
			if (error || !clubData) return { error: z.prettifyError(error) };

			return { data: clubData };
		},
		actionFn: async (data) => {
			if (!data) throw new Error('Club not found');
			const newClub = await insertClub(data);

			const subdomain = getSubdomainURL(newClub.subdomain);
			redirect(subdomain);
		},
	});
}

interface JoinLeaveClubBody {
	userId?: string;
	club?: SelectClub;
}
export async function joinClub({
	userId,
	club,
}: JoinLeaveClubBody): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { userId, club },
		actionFn: async (_data, params) => {
			if (!params) throw new Error('Missing parameters.');
			if (!params.userId) throw new Error('Unauthorized');
			if (!params.club) throw new Error('Club not found.');

			await addUserToClub(params.userId, params.club.id);

			return { pathToRevalidate: `/s/${params.club.subdomain}` };
		},
	});
}

export async function leaveClub({
	userId,
	club,
}: JoinLeaveClubBody): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { userId, club },
		actionFn: async (_data, params) => {
			if (!params) throw new Error('Missing parameters.');
			if (!params.userId) throw new Error('Unauthorized');
			if (!params.club) throw new Error('Club not found.');

			await removeUserFromClub(params.userId, params.club.id);

			return { pathToRevalidate: `/s/${params.club.subdomain}` };
		},
	});
}

export async function setClubActiveStatus(
	clubId: string,
	isActive: boolean
): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { clubId, isActive },
		validationFn: async () => {
			const club = await getClubById(clubId);
			if (!club) return { error: 'Club not found' };
			const user = await getCurrentUser();
			if (!user) return { error: 'Unauthorized' };
			if (club.ownerId !== user.id) return { error: 'Unauthorized' };

			return { success: true };
		},
		actionFn: async (_data, params) => {
			if (!params) throw new Error('Missing parameters.');

			const newClub = await updateClubActiveStatus(
				params.clubId,
				params.isActive
			);

			return { pathToRevalidate: `/s/${newClub.subdomain}` };
		},
	});
}

export async function removeClub(clubId: string): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { clubId },
		validationFn: async () => {
			const club = await getClubById(clubId);
			if (!club) return { error: 'Club not found' };
			const user = await getCurrentUser();
			if (!user) return { error: 'Unauthorized' };
			if (club.ownerId !== user.id) return { error: 'Unauthorized' };

			return { success: true, data: club };
		},
		actionFn: async (data) => {
			if (!data) throw new Error('Club not found');

			await deleteClub(data.id);

			return { pathToRevalidate: `/s/${data.subdomain}` };
		},
	});
}

export async function updateAccountDetails(
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	return await createServerAction({
		validationFn: async () => {
			const user = await getCurrentUser();
			if (!user)
				return {
					error: 'Unauthorized',
				};

			const rawFormData = {
				displayName: formData.get('displayName'),
				avatar: formData.get('avatar'),
			};
			const { data: form, error } = updateAccountSchema.safeParse(rawFormData);
			if (error)
				return {
					error: z.prettifyError(error),
				};

			return { data: { form, user } };
		},
		actionFn: async (data) => {
			if (!data) throw new Error('Account details required');

			if (
				data.form.displayName &&
				data.form.displayName !== data.user.displayName
			) {
				await updateUser(data.user.id, {
					displayName: data.form.displayName,
				});
			}

			if (data.form.avatar) {
				await removeUserAvatars(data.user.id);
				const { publicUrl } = await uploadUserAvatar(
					data.user.id,
					data.form.avatar
				);
				await updateUser(data.user.id, {
					imageURL: publicUrl,
				});
			}

			return { pathToRevalidate: '/account/details' };
		},
	});
}

export async function deleteUserAvatar(): Promise<ActionState> {
	return await createServerAction({
		validationFn: async () => {
			const user = await getCurrentUser();
			if (!user)
				return {
					error: 'Unauthorized',
				};

			return { data: user };
		},
		actionFn: async (data) => {
			if (!data) throw new Error('Unauthorized');

			await removeUserAvatars(data.id);
			await updateUser(data.id, {
				imageURL: null,
			});

			return { pathToRevalidate: '/account/details' };
		},
	});
}

interface UploadSongFileBody {
	clubId: string;
	duration: number;
	originalSong?: SelectBaseSong; // a song's audio source is being updated
}
export async function uploadSongFile(
	{ clubId, duration, originalSong }: UploadSongFileBody,
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { clubId, duration, originalSong },
		validationFn: async () => {
			const user = await getCurrentUser();
			if (!user)
				return {
					error: 'Unauthorized',
				};

			const club = await getClubById(clubId);
			if (!club)
				return {
					error: 'Your current club was not found',
				};

			const rawFormData = {
				title: formData.get('title'),
				artist: formData.get('artist'),
				album: formData.get('album'),
				audioFile: formData.get('audio_file'),
			};

			const { data: songDetails, error } = uploadSongSchema.safeParse({
				...formData,
				artist: [rawFormData.artist],
			});

			if (error && !originalSong)
				return {
					error: z.prettifyError(error),
				};

			return { data: { songDetails, club } };
		},
		actionFn: async (data) => {
			if (!data) throw new Error('Invalid song details');

			const { songDetails, club } = data;
			if (!songDetails || !songDetails?.audioFile)
				throw new Error('Invalid song details');

			if (originalSong) {
				const { publicUrl } = await upsertSongFile(
					songDetails.audioFile,
					originalSong
				);
				await updateClubSongAudio({
					id: originalSong.id,
					audio: publicUrl,
					duration,
				});
			} else {
				const fileName = `${sanitizeString(songDetails.title)}.mp3`;
				const { publicUrl } = await uploadCustomClubSongFile(
					songDetails.audioFile,
					club.id,
					fileName
				);

				await insertClubSong({
					id: generateSecureRandomString(),
					clubId: club.id,
					title: songDetails.title,
					artist: songDetails.artist,
					album: songDetails.album,
					audio: publicUrl,
					duration,
					source: 'file_upload',
				});
			}

			return { pathToRevalidate: `/s/${club.subdomain}` };
		},
	});
}

export async function deleteSong(song: SelectBaseSong): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { song },
		validationFn: async () => {
			const user = await getCurrentUser();
			if (!user)
				return {
					error: 'Unauthorized',
				};

			const club = await getClubById(song.clubId);
			if (!club)
				return {
					error: 'The club for this song was not found',
				};

			const isOwner = user.id === club.ownerId;
			if (!isOwner)
				return {
					error: 'Unauthorized',
				};

			return { data: { user, club } };
		},
		actionFn: async (data) => {
			if (!data) throw new Error('Unauthorized');

			await deleteClubSong(song.id);
			await removeClubSongFile(song);

			return { pathToRevalidate: `/s/${data.club.subdomain}` };
		},
	});
}

interface EditSongBody {
	song?: SelectBaseSong;
	duration: number;
}
export async function updateSongDuration({
	song,
	duration,
}: EditSongBody): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { song, duration },
		validationFn: async (data) => {
			if (!data || !data.song) throw new Error('Song and duration required');

			const user = await getCurrentUser();
			if (!user)
				return {
					error: 'Unauthorized',
				};

			const club = await getClubById(data.song.clubId);
			if (!club)
				return {
					error: 'The club for this song was not found',
				};

			const { data: durationData, error } = insertBaseSongSchema
				.pick({
					duration: true,
				})
				.safeParse({ duration });
			if (error)
				return {
					error: z.prettifyError(error),
				};

			return { data: { duration: durationData.duration, song, club } };
		},
		actionFn: async (data) => {
			if (!data || !data.song) throw new Error('Song and duration required');

			await updateClubSongDuration(data.song.id, data.duration);

			return { pathToRevalidate: `/s/${data.club.subdomain}` };
		},
	});
}

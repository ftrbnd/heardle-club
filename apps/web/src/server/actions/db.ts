'use server';

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
		sessionRequired: true,
		validationFn: async (user, { artistId }) => {
			const rawFormData = {
				id: generateSecureRandomString(),
				artistId: artistId,
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
		actionFn: async (_user, _params, data) => {
			if (!data) throw new Error('Club not found');
			const newClub = await insertClub(data);

			const subdomain = getSubdomainURL(newClub.subdomain);
			redirect(subdomain);
		},
	});
}

interface JoinLeaveClubBody {
	userId: string;
	club: SelectClub;
}
export async function joinClub({
	userId,
	club,
}: JoinLeaveClubBody): Promise<ActionState> {
	return await createServerAction({
		requiredParams: { userId, club },
		actionFn: async (_user, params) => {
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
		actionFn: async (_user, params) => {
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
		sessionRequired: true,
		validationFn: async (user, params) => {
			const club = await getClubById(params.clubId);
			if (!club) return { error: 'Club not found' };
			if (club.ownerId !== user.id) return { error: 'Unauthorized' };

			return { success: true };
		},
		actionFn: async (_user, params) => {
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
		sessionRequired: true,
		validationFn: async (user, params) => {
			const club = await getClubById(params.clubId);
			if (!club) return { error: 'Club not found' };
			if (club.ownerId !== user.id) return { error: 'Unauthorized' };

			return { data: { club } };
		},
		actionFn: async (_user, _params, data) => {
			if (!data) throw new Error('Club not found');

			await deleteClub(data.club.id);

			return { pathToRevalidate: `/s/${data.club.subdomain}` };
		},
	});
}

export async function updateAccountDetails(
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	return await createServerAction({
		sessionRequired: true,
		validationFn: async () => {
			const rawFormData = {
				displayName: formData.get('displayName'),
				avatar: formData.get('avatar'),
			};

			const { data: form, error } = updateAccountSchema.safeParse(rawFormData);
			if (error)
				return {
					error: z.prettifyError(error),
				};

			return { data: { form } };
		},
		actionFn: async (user, _params, data) => {
			if (!data) throw new Error('Account details required');

			if (data.form.displayName && data.form.displayName !== user.displayName) {
				await updateUser(user.id, {
					displayName: data.form.displayName,
				});
			}

			if (
				data.form.avatar &&
				data.form.avatar.type !== 'application/octet-stream'
			) {
				await removeUserAvatars(user.id);
				const { publicUrl } = await uploadUserAvatar(user.id, data.form.avatar);
				await updateUser(user.id, {
					imageURL: publicUrl,
				});
			}

			return { pathToRevalidate: '/account/details' };
		},
	});
}

export async function deleteUserAvatar(): Promise<ActionState> {
	return await createServerAction({
		sessionRequired: true,
		actionFn: async (user) => {
			await removeUserAvatars(user.id);
			await updateUser(user.id, {
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
		sessionRequired: true,
		validationFn: async (_user, params) => {
			const club = await getClubById(params.clubId);
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

			if (error && !params.originalSong)
				return {
					error: z.prettifyError(error),
				};

			return { data: { songDetails, club } };
		},
		actionFn: async (_user, params, data) => {
			if (!data) throw new Error('Invalid song details');

			const { songDetails, club } = data;
			if (!songDetails || !songDetails?.audioFile)
				throw new Error('Invalid song details');

			if (params.originalSong) {
				const { publicUrl } = await upsertSongFile(
					songDetails.audioFile,
					params.originalSong
				);
				await updateClubSongAudio({
					id: params.originalSong.id,
					audio: publicUrl,
					duration: params.duration,
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
					duration: params.duration,
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
		sessionRequired: true,
		validationFn: async (user, { song }) => {
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

			return { data: { club } };
		},
		actionFn: async (_user, { song }, data) => {
			if (!data) throw new Error('The club for this song was not found');

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
		sessionRequired: true,
		validationFn: async (_user, params) => {
			if (!params.song) throw new Error('Song and duration required');

			const club = await getClubById(params.song.clubId);
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
		actionFn: async (_user, { song, duration }, data) => {
			if (!data || !song) throw new Error('Song and club not found');

			await updateClubSongDuration(song.id, duration);

			return { pathToRevalidate: `/s/${data.club.subdomain}` };
		},
	});
}

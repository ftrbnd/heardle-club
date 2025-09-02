'use server';

import { getCurrentUser } from '@/app/api/auth/server.services';
import { getSubdomainURL } from '@/lib/domains';
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
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type ActionState = {
	error?: string;
	success?: boolean;
};

export async function createClub(
	artistId: string,
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	const user = await getCurrentUser();
	if (!user) return { error: 'Unauthorized' };

	const rawFormData = {
		id: generateSecureRandomString(),
		artistId,
		ownerId: user.id,
		subdomain: formData.get('subdomain'),
		displayName: formData.get('displayName'),
		// TODO: support image uploading
		//  imageURL: formData.get('image'),
	};

	const { data, error } = insertClubSchema.safeParse(rawFormData);
	if (error) return { error: error.message };

	try {
		const newClub = await insertClub(data);

		const subdomain = getSubdomainURL(newClub.subdomain);
		redirect(subdomain);
	} catch (error) {
		if (error instanceof Error)
			return {
				error: error.message,
			};
	}

	return {
		error: 'Something went wrong.',
	};
}

interface JoinLeaveClubBody {
	userId?: string;
	club?: SelectClub;
}
export async function joinClub({
	userId,
	club,
}: JoinLeaveClubBody): Promise<ActionState> {
	if (!userId)
		return {
			error: 'Sign in to join a club.',
		};
	if (!club)
		return {
			error: 'Club not found...',
		};

	try {
		await addUserToClub(userId, club.id);

		revalidatePath(`/s/${club.subdomain}`);

		return {
			success: true,
		};
	} catch (error) {
		if (error instanceof Error)
			return {
				error: error.message,
			};
	}

	return {
		error: 'Something went wrong.',
	};
}

export async function leaveClub({
	userId,
	club,
}: JoinLeaveClubBody): Promise<ActionState> {
	if (!userId)
		return {
			error: 'Sign in to leave a club.',
		};
	if (!club)
		return {
			error: 'Club not found...',
		};

	try {
		await removeUserFromClub(userId, club.id);

		revalidatePath(`/s/${club.subdomain}`);

		return {
			success: true,
		};
	} catch (error) {
		if (error instanceof Error)
			return {
				error: error.message,
			};
	}

	return {
		error: 'Something went wrong.',
	};
}

export async function setClubActiveStatus(
	clubId: string,
	isActive: boolean
): Promise<ActionState> {
	const club = await getClubById(clubId);
	if (!club) return { error: 'Club not found' };
	const user = await getCurrentUser();
	if (!user) return { error: 'Unauthorized' };
	if (club.ownerId !== user.id) return { error: 'Unauthorized' };

	try {
		const newClub = await updateClubActiveStatus(clubId, isActive);
		revalidatePath(`/s/${newClub.subdomain}`);

		return { success: true };
	} catch (error) {
		if (error instanceof Error)
			return {
				error: error.message,
			};
	}

	return {
		error: 'Something went wrong.',
	};
}

export async function removeClub(clubId: string): Promise<ActionState> {
	const club = await getClubById(clubId);
	if (!club) return { error: 'Club not found' };
	const user = await getCurrentUser();
	if (!user) return { error: 'Unauthorized' };
	if (club.ownerId !== user.id) return { error: 'Unauthorized' };

	try {
		await deleteClub(clubId);
		revalidatePath(`/s/${club.subdomain}`);

		return { success: true };
	} catch (error) {
		if (error instanceof Error)
			return {
				error: error.message,
			};
	}

	return {
		error: 'Something went wrong.',
	};
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

			revalidatePath('/account/details');

			return {
				success: true,
			};
		} catch (error) {
			if (error instanceof Error) {
				return {
					error: error.message,
				};
			}
		}
	}

	return {
		error: 'Something went wrong.',
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

interface UploadSongFileBody {
	clubId: string;
	duration: number;
	originalSong?: SelectBaseSong;
}
export async function uploadSongFile(
	{ clubId, duration, originalSong }: UploadSongFileBody,
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
	if (error && !originalSong)
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
			if (originalSong) {
				const { publicUrl } = await upsertSongFile(
					rawFormData.audioFile,
					originalSong
				);
				await updateClubSongAudio({
					id: originalSong.id,
					audio: publicUrl,
					duration,
				});
			} else {
				if (!songDetails)
					return {
						error: 'Provide valid song details.',
					};

				const fileName = `${sanitizeString(songDetails.title)}.mp3`;
				const { publicUrl } = await uploadCustomClubSongFile(
					rawFormData.audioFile,
					clubId,
					fileName
				);

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
			}

			revalidatePath(`/s/${club.subdomain}`);

			return {
				success: true,
			};
		} catch (error) {
			if (error instanceof Error)
				return {
					error: error.message,
				};
			return {
				error: 'Something went wrong.',
			};
		}
	} else {
		return {
			error: 'An audio file is required.',
		};
	}
}

export async function deleteSong(song: SelectBaseSong): Promise<ActionState> {
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

	try {
		await deleteClubSong(song.id);
		await removeClubSongFile(song);

		revalidatePath(`/s/${club.subdomain}`);

		return {
			success: true,
		};
	} catch (error) {
		if (error instanceof Error)
			return {
				error: error.message,
			};
	}

	return {
		error: 'Something went wrong.',
	};
}

interface EditSongBody {
	song?: SelectBaseSong;
	duration: number;
}
export async function updateSongDuration({
	song,
	duration,
}: EditSongBody): Promise<ActionState> {
	if (!song)
		return {
			error: 'Please provide a song.',
		};

	const user = await getCurrentUser();
	if (!user)
		return {
			error: 'Unauthorized',
		};

	const { data, error } = insertBaseSongSchema
		.pick({
			duration: true,
		})
		.safeParse({ duration });
	if (error)
		return {
			error: error.message,
		};

	const club = await getClubById(song.clubId);
	if (!club)
		return {
			error: 'The club for this song was not found',
		};

	if (data) {
		try {
			await updateClubSongDuration(song.id, data.duration);

			revalidatePath(`/s/${club.subdomain}`);

			return {
				success: true,
			};
		} catch (error) {
			if (error instanceof Error)
				return {
					error: error.message,
				};
		}
	}

	return {
		error: 'Something went wrong.',
	};
}

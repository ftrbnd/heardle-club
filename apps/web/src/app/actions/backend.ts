'use server';

import { serverURL } from '@/util/domains';
import { getSessionToken } from '@/app/actions/auth';
import { getClubById, getClubSongs } from '@repo/database/postgres/api';
import { revalidatePath } from 'next/cache';

type ActionState = {
	error?: string;
	success?: boolean;
};

export async function submitClubSongs(
	clubId: string,
	prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	if (!formData)
		return {
			error: 'Submit at least one song.',
		};

	const token = await getSessionToken();
	if (!token)
		return {
			error: 'Unauthorized',
		};

	const trackIds = [
		...formData
			.values()
			.filter((val) => val.toString().startsWith('track_'))
			.map((track) => track.toString().replace('track_', '')),
	];

	if (trackIds.length === 0)
		return {
			error: 'Select at least one track.',
		};

	const clubSongs = await getClubSongs(clubId);
	const trackIdsWithoutDuplicates = trackIds.filter(
		(id) => !clubSongs.find((song) => song.trackId === id)
	);
	if (trackIdsWithoutDuplicates.length === 0) {
		const pluralCheck = trackIds.length === 1 ? 'this song' : 'these songs';
		return { error: `Your club already has ${pluralCheck}.` };
	}

	const res = await fetch(`${serverURL}/clubs/${clubId}/download`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			trackIds: trackIdsWithoutDuplicates,
		}),
	});
	if (!res.ok) {
		return {
			error: res.statusText,
		};
	}

	const club = await getClubById(clubId);
	revalidatePath(`/s/${club?.subdomain}`);

	return {
		success: true,
	};
}

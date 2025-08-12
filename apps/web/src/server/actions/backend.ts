'use server';

import { serverURL } from '@/lib/domains';
import { getCurrentUser } from '@/app/api/auth/server.services';
import { getClubSongs, setDownloadStatus } from '@repo/database/api';

type ActionState = {
	error?: string;
	success?: boolean;
};

export async function submitClubSongs(
	clubId: string,
	prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	const user = await getCurrentUser();
	if (!user) {
		return { error: 'Unauthorized' };
	}

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

	// TODO: set redis status
	await setDownloadStatus(clubId, 0, trackIdsWithoutDuplicates.length);

	await fetch(`${serverURL}/clubs/${clubId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId: user.id,
			trackIds: trackIdsWithoutDuplicates,
		}),
	});

	return {
		success: true,
	};
}

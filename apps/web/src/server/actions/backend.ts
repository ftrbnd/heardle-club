'use server';

import { serverURL } from '@/lib/domains';
import { getCurrentUser } from '@/app/api/auth/server.services';
import { setDownloadStatus } from '@repo/database/api';

export async function submitClubSongs(clubId: string, formData: FormData) {
	const user = await getCurrentUser();
	if (!user) throw new Error('Unauthorized');

	const trackIds = [
		...formData
			.values()
			.filter((val) => val.toString().startsWith('track_'))
			.map((track) => track.toString().replace('track_', '')),
	];

	if (trackIds.length === 0) return;

	// TODO: set redis status
	await setDownloadStatus(clubId, 0, trackIds.length);

	await fetch(`${serverURL}/clubs/${clubId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId: user.id,
			trackIds,
		}),
	});
}

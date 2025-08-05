'use server';

import { serverURL } from '@/lib/domains';
import { getCurrentUser } from '@/server/actions/auth';

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

	const res = await fetch(`${serverURL}/clubs/${clubId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId: user.id,
			trackIds,
		}),
	});

	if (!res.ok) {
		console.error(res);
		throw new Error(`Failed to send ${trackIds.length} tracks to server`);
	}
}

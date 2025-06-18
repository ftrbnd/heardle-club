import { getClubs } from '@repo/database/api';

export async function resetAllClubs() {
	const clubs = await getClubs();
	console.log({ clubs });

	for (const club of clubs) {
		await resetClub(club.id);
	}
}

async function resetClub(clubId: string) {
	console.log({ clubId });
}

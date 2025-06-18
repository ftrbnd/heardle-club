import Elysia from 'elysia';
import cron from '@elysiajs/cron';
import { getClubs } from '@repo/database/api';

export const cronPlugin = new Elysia().use(
	cron({
		name: 'daily',
		pattern: '0 4 * * *',
		async run() {
			await resetAllClubs();
		},
	})
);

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

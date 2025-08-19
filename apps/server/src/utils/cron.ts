import Elysia from 'elysia';
import cron from '@elysiajs/cron';
import { getAllActiveClubs } from '@repo/database/api';
import { Club } from '@/modules/clubs/service';

export const cronPlugin = new Elysia().use(
	cron({
		name: 'daily',
		pattern: '* * * * *',
		async run() {
			await resetAllClubs();
		},
	})
);

export async function resetAllClubs() {
	const clubs = await getAllActiveClubs();

	for (const club of clubs) {
		try {
			await resetClub(club.id);
		} catch (error) {
			if (error instanceof Error) console.log(error.message);
			continue;
		}
	}
}

async function resetClub(clubId: string) {
	await Club.setDailySong(clubId);
}

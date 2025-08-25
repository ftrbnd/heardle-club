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
			await Club.setDailySong(club.id);
		} catch (error) {
			if (error instanceof Error)
				if (error.message === 'Club has no songs')
					console.log(`${club.displayName} has no songs yet`);
				else console.log('Failed to set daily song:', error);
			continue;
		}
	}
}

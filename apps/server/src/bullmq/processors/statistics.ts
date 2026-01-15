import {
	getUsersFromClub,
	updateUserStatistics,
} from '@repo/database/postgres/api';
import { getUserGuesses, resetClubGuesses } from '@repo/database/redis/api';

export async function updateClubStatistics(clubId: string) {
	await updateStreaks(clubId);

	console.log(`Resetting club #${clubId}'s guesses...`);
	await resetClubGuesses(clubId);
	console.log(`Reset club #${clubId}'s guesses`);
}

async function updateStreaks(clubId: string) {
	const users = await getUsersFromClub(clubId);

	for (const user of users) {
		console.log(`Updating user #${user.id}'s streak...`);
		const guesses = await getUserGuesses({
			userId: user.id,
			clubId,
		});

		const guessedCorrectly = guesses.some(
			(guess) => guess.status === 'correct'
		);
		console.log(
			`User #${user.id} guessed ${guessedCorrectly ? 'correctly' : 'incorrectly'}`
		);
		if (!guessedCorrectly) {
			console.log('Resetting their streak to 0...');
			await updateUserStatistics(user.id, clubId, {
				currentStreak: 0,
			});
		}
	}
}

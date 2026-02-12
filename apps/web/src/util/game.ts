import { BareStatistics } from '@repo/database/postgres/api';
import { SelectStatistics } from '@repo/database/postgres/schema';
import { Guess } from '@repo/database/redis/schema';

export const GUESS_LIMIT = 6 as const;

export const correctlyGuessedHeardle = (guesses: Guess[]) =>
	guesses.some((guess) => guess.status === 'correct');

export const completedHeardle = (guesses: Guess[]) =>
	guesses.length >= GUESS_LIMIT || correctlyGuessedHeardle(guesses);

export function getShareableSquares(guesses: Guess[]) {
	const correspondingSquare = (status: Guess['status']) => {
		switch (status) {
			case 'correct':
				return '🟩';
			case 'album':
				return '🟧';
			case 'wrong':
				return '🟥';
		}
	};

	const squares = guesses.map((g) => correspondingSquare(g.status));
	return squares.join('');
}

export const DEFAULT_STATISTICS: BareStatistics = {
	accuracy: 0,
	currentStreak: 0,
	gamesPlayed: 0,
	gamesWon: 0,
	maxStreak: 0,
} as const;

export function computeNewStatistics(
	prevStats: SelectStatistics,
	guesses?: Guess[],
) {
	let gameAccuracy = 0;
	// find index of first green square
	const greenSquareIndex = guesses?.findIndex(
		(guess) => guess.status === 'correct',
	);
	// calculate accuracy for this game based on range of 0 to GUESS_LIMIT
	gameAccuracy =
		greenSquareIndex === -1
			? 0
			: GUESS_LIMIT - (greenSquareIndex ?? GUESS_LIMIT);

	const guessedSong = guesses?.some((g) => g.status === 'correct');
	const finishedGame = guessedSong || guesses?.length === GUESS_LIMIT;

	const currentStreak = finishedGame
		? guessedSong
			? prevStats.currentStreak + 1
			: 0
		: prevStats.currentStreak; // don't reset to 0 if they haven't finished the game yet

	return {
		...prevStats,
		gamesPlayed: prevStats.gamesPlayed + 1,
		gamesWon: guessedSong ? prevStats.gamesWon + 1 : prevStats.gamesWon,
		currentStreak,
		maxStreak: Math.max(prevStats.maxStreak, currentStreak),
		accuracy: prevStats.accuracy + gameAccuracy,
	};
}

export function computeAccuracyPercentage(
	accuracyPoints: number,
	gamesPlayed: number,
) {
	return Math.round(
		(accuracyPoints / ((gamesPlayed || 1) * GUESS_LIMIT)) * 100,
	);
}

export function computeMissedGuesses(gamesPlayed: number, accuracy: number) {
	return gamesPlayed * GUESS_LIMIT - accuracy;
}

export function computeWinPercentage(gamesPlayed: number, gamesWon: number) {
	return gamesPlayed === 0 ? 0 : Math.floor((gamesWon / gamesPlayed) * 100);
}

export function computeStreakStartDate(currentStreak: number) {
	const streakStart = new Date();
	streakStart.setDate(streakStart.getDate() - currentStreak);

	return streakStart.toLocaleDateString(undefined, {
		month: 'long',
		day: 'numeric',
		// Only show year if it's a past year
		year:
			new Date().getFullYear() !== streakStart.getFullYear()
				? 'numeric'
				: undefined,
	});
}

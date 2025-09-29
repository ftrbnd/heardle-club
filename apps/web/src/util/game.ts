import { Guess } from '@repo/database/redis/schema';

export const GUESS_LIMIT = 6 as const;

const correctlyGuessedHeardle = (guesses: Guess[]) =>
	guesses.some((guess) => guess.status === 'correct');

export const completedHeardle = (guesses: Guess[]) =>
	guesses.length >= 6 || correctlyGuessedHeardle(guesses);

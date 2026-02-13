import { redis } from '..';
import {
	Guess,
	clubUserGuessesKey,
	guessesSchema,
	UserGuessIDs,
	clubGuessesKey,
} from '../schema/guesses';

export const getUserGuesses = async (ids: UserGuessIDs) => {
	const data = await redis.json.get(clubUserGuessesKey(ids));
	const prevGuesses = guessesSchema.nullable().default([]).parse(data);

	return prevGuesses ?? [];
};

export const addUserGuess = async (ids: UserGuessIDs, newGuess: Guess) => {
	const prevGuesses = await redis.json.get(clubUserGuessesKey(ids));
	if (prevGuesses) {
		const p = redis.multi();

		p.json.arrappend(clubUserGuessesKey(ids), '$', newGuess);
		p.json.get(clubUserGuessesKey(ids));

		const [_newLength, newGuesses] = await p.exec<[number, Guess[]]>();
		return newGuesses;
	} else {
		await redis.json.set(clubUserGuessesKey(ids), '$', [newGuess]);
		return [newGuess];
	}
};

/**
 * @returns an array of keys of each user's club guesses
 * @example ['guesses:001:001', 'guesses:002:001']
 */
export const getClubGuesses = async (clubId: string) => {
	const clubGuesses = await redis.keys(clubGuessesKey(clubId));

	return clubGuesses;
};

export const resetClubGuesses = async (clubId: string) => {
	const clubGuesses = await redis.keys(clubGuessesKey(clubId));

	if (clubGuesses.length > 0) {
		await redis.del(...clubGuesses);
	}
};

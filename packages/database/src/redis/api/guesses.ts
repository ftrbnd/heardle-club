import { redis } from '..';
import {
	Guess,
	guessesKey,
	guessesSchema,
	UserGuessIDs,
} from '../schema/guesses';

export const getUserGuesses = async (ids: UserGuessIDs) => {
	const data = await redis.json.get(guessesKey(ids));
	const prevGuesses = guessesSchema.nullable().default([]).parse(data);

	return prevGuesses ?? [];
};

export const addUserGuess = async (ids: UserGuessIDs, newGuess: Guess) => {
	const prevGuesses = await redis.json.get(guessesKey(ids));
	if (prevGuesses) {
		const p = redis.multi();

		p.json.arrappend(guessesKey(ids), '$', newGuess);
		p.json.get(guessesKey(ids));

		const [_newLength, newGuesses] = await p.exec<[number, Guess[]]>();
		return newGuesses;
	} else {
		await redis.json.set(guessesKey(ids), '$', [newGuess]);
		return [newGuess];
	}
};

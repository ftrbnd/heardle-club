import { redis } from '..';
import {
	Guess,
	guessesKey,
	guessesSchema,
	UserGuessIDs,
} from '../schema/guesses';

export const getUserGuesses = async (ids: UserGuessIDs) => {
	const data = await redis.json.get(guessesKey(ids));
	const res = guessesSchema.parse(data);

	return res;
};

export const addUserGuess = async (ids: UserGuessIDs, newGuess: Guess) => {
	const p = redis.multi();

	p.json.arrappend(guessesKey(ids), '$', newGuess);
	p.json.get(guessesKey(ids));

	const newGuesses = await p.exec<Guess[]>();
	return newGuesses;
};

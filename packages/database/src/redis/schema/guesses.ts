import { z } from 'zod/v4';

export interface UserGuessIDs {
	userId: string;
	clubId: string;
}

export const guessesKey = (ids: UserGuessIDs) =>
	`guesses:${ids.userId}:${ids.clubId}` as const;

export const guessSchema = z.object({
	songId: z.string(),
	status: z.enum(['correct', 'wrong', 'album']),
});
export const guessesSchema = guessSchema.array();

export type Guess = z.infer<typeof guessSchema>;

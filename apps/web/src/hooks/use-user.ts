import {
	getUser,
	getUserGuesses,
	submitUserGuess,
} from '@/app/api/users.service';
import { customToast } from '@/components/layout/toast';
import { useClub } from '@/hooks/use-club';
import { GUESS_LIMIT } from '@/util/game';
import { Guess } from '@repo/database/redis/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUser() {
	const { club } = useClub();
	const queryClient = useQueryClient();

	const { data: user } = useQuery({
		queryKey: ['me'],
		queryFn: getUser,
		retry: 3,
	});

	const { data: guesses } = useQuery({
		queryKey: ['me', 'guesses', club?.id],
		queryFn: () => getUserGuesses(club?.id),
		enabled: club?.id !== undefined && user !== undefined,
	});

	const { mutateAsync } = useMutation({
		// concurrent optimistic updates: https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query
		mutationKey: ['guesses'],
		mutationFn: (guess: Guess) => submitUserGuess(guess, club?.id),
		onMutate: async (guess) => {
			await queryClient.cancelQueries({
				queryKey: ['me', 'guesses', club?.id],
			});

			const prevGuesses = queryClient.getQueryData<Guess[]>([
				'me',
				'guesses',
				club?.id,
			]);

			if (prevGuesses) {
				const guessLimitReached = prevGuesses.length >= GUESS_LIMIT;

				if (guessLimitReached) {
					queryClient.setQueryData<Guess[]>(
						['me', 'guesses', club?.id],
						(oldGuesses) => oldGuesses
					);
				} else {
					queryClient.setQueryData<Guess[]>(
						['me', 'guesses', club?.id],
						(oldGuesses) => (oldGuesses ? [...oldGuesses, guess] : oldGuesses)
					);
				}
			}

			return { prevGuesses };
		},
		onError: (error, _guess, onMutateResult) => {
			customToast({
				message: error.message,
				type: 'error',
			});

			queryClient.setQueryData(
				['me', 'guesses', club?.id],
				onMutateResult?.prevGuesses
			);
		},
		onSuccess: (guess) => {
			const lastGuess = guess.at(-1)?.status;
			customToast({
				message: `Guessed ${lastGuess}`,
				type: 'success',
			});
		},
		onSettled: () => {
			if (queryClient.isMutating({ mutationKey: ['guesses'] }) === 1) {
				queryClient.invalidateQueries({
					queryKey: ['me', 'guesses', club?.id],
				});
			}
		},
	});

	return {
		user,
		guesses,
		submitGuess: mutateAsync,
	};
}

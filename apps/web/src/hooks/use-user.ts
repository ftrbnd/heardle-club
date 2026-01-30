import {
	getUser,
	getUserGuesses,
	getUserStatistics,
	setUserStatistics,
	submitUserGuess,
} from '@/app/api/users.service';
import { customToast } from '@/components/layout/toast';
import { useClub } from '@/hooks/use-club';
import { computeNewStatistics, GUESS_LIMIT } from '@/util/game';
import { SelectStatistics } from '@repo/database/postgres/schema';
import { Guess } from '@repo/database/redis/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const MyUserQueryKey = ['users', 'me'] as const;
const GuessQueryKey = (clubId?: string) => [
	...MyUserQueryKey,
	'guesses',
	clubId,
];
const StatsQueryKey = (clubId?: string) => [
	...MyUserQueryKey,
	'statistics',
	clubId,
];

export function useUser() {
	const { club } = useClub();
	const queryClient = useQueryClient();

	const { data: user } = useQuery({
		queryKey: MyUserQueryKey,
		queryFn: getUser,
		retry: 3,
	});

	const { data: guesses } = useQuery({
		queryKey: GuessQueryKey(club?.id),
		queryFn: () => getUserGuesses(user?.id, club?.id),
		enabled: club?.id !== undefined && user !== undefined && user !== null,
	});

	const { data: statistics } = useQuery({
		queryKey: StatsQueryKey(club?.id),
		queryFn: () => getUserStatistics(user?.id, club?.id),
		enabled: club?.id !== undefined && user !== undefined && user !== null,
	});

	const { mutateAsync: submitGuess } = useMutation({
		// concurrent optimistic updates: https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query
		mutationKey: ['guesses'],
		mutationFn: (guess: Guess) => submitUserGuess(guess, user?.id, club?.id),
		onMutate: async (guess) => {
			await queryClient.cancelQueries({
				queryKey: GuessQueryKey(club?.id),
			});

			const prevGuesses = queryClient.getQueryData<Guess[]>(
				GuessQueryKey(club?.id)
			);

			if (prevGuesses) {
				const guessLimitReached = prevGuesses.length >= GUESS_LIMIT;

				if (guessLimitReached) {
					queryClient.setQueryData<Guess[]>(
						GuessQueryKey(club?.id),
						(oldGuesses) => oldGuesses
					);
				} else {
					queryClient.setQueryData<Guess[]>(
						GuessQueryKey(club?.id),
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
				GuessQueryKey(club?.id),
				onMutateResult?.prevGuesses
			);
		},
		onSuccess: async (guesses) => {
			const lastGuess = guesses.at(-1)?.status;
			customToast({
				message: `Guessed ${lastGuess}`,
				type: 'success',
			});

			await updateStatistics(guesses);
		},
		onSettled: async () => {
			if (queryClient.isMutating({ mutationKey: ['guesses'] }) === 1) {
				await queryClient.invalidateQueries({
					queryKey: GuessQueryKey(club?.id),
				});
			}
		},
	});

	const { mutateAsync: updateStatistics } = useMutation({
		mutationKey: ['statistics'],
		mutationFn: (newGuesses?: Guess[]) =>
			setUserStatistics(user?.id, club?.id, newGuesses),
		onMutate: async (guesses) => {
			await queryClient.cancelQueries({
				queryKey: StatsQueryKey(club?.id),
			});

			const prevStats = queryClient.getQueryData<SelectStatistics>(
				StatsQueryKey(club?.id)
			);

			if (prevStats) {
				const newStats = computeNewStatistics(prevStats, guesses);

				queryClient.setQueryData<SelectStatistics>(
					StatsQueryKey(club?.id),
					newStats
				);
			}

			return { prevStats };
		},
		onError: (error, _guess, onMutateResult) => {
			customToast({
				message: error.message,
				type: 'error',
			});

			queryClient.setQueryData(
				StatsQueryKey(club?.id),
				onMutateResult?.prevStats
			);
		},
		onSettled: () => {
			if (queryClient.isMutating({ mutationKey: ['statistics'] }) === 1) {
				queryClient.invalidateQueries({
					queryKey: StatsQueryKey(club?.id),
				});
			}
		},
	});

	return {
		user,
		guesses,
		submitGuess,
		statistics,
		updateStatistics,
	};
}

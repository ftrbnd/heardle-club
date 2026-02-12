'use client';

import AudioPlayer from '@/app/(subdomain)/s/[subdomain]/play/_components/audio-player';
import { Guess } from '@/app/(subdomain)/s/[subdomain]/play/_components/guess';
import { ResultCard } from '@/app/(subdomain)/s/[subdomain]/play/_components/result-card';
import { SongSelect } from '@/app/(subdomain)/s/[subdomain]/play/_components/song-select';
import { useClub } from '@/hooks/use-club';
import { useUser } from '@/hooks/use-user';
import { completedHeardle, correctlyGuessedHeardle } from '@/util/game';

export default function Page() {
	const { daily, dailyLoading, songs, club } = useClub();
	const { guesses } = useUser();

	return (
		<div className='flex-1 flex flex-col items-center'>
			<div className='flex-1 flex flex-col p-2 gap-2 play-page-width'>
				{guesses &&
					guesses.map((guess, index) => (
						<Guess
							key={index}
							guess={guess}
							song={songs?.find((song) => song.id === guess.songId)}
							className='w-full'
						/>
					))}
			</div>

			{/* TODO: don't rely on conditional - use useSuspenseQuery? */}
			{guesses && club && daily && completedHeardle(guesses) && (
				<ResultCard
					club={club}
					song={daily.song}
					guessedSong={correctlyGuessedHeardle(guesses)}
				/>
			)}

			<SongSelect
				songs={songs}
				correctSong={daily?.song}
				className='justify-self-end'
			/>
			<AudioPlayer
				loading={dailyLoading}
				url={daily?.url}
				className='justify-self-end'
			/>
		</div>
	);
}

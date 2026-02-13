'use client';

import AudioPlayer from '@/app/(subdomain)/s/[subdomain]/play/_components/audio-player';
import { Guess } from '@/app/(subdomain)/s/[subdomain]/play/_components/guess';
import { ResultCard } from '@/app/(subdomain)/s/[subdomain]/play/_components/result-card';
import { SongSelect } from '@/app/(subdomain)/s/[subdomain]/play/_components/song-select';
import { useClub } from '@/hooks/use-club';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/util';
import { completedHeardle, correctlyGuessedHeardle } from '@/util/game';
import { ComponentProps } from 'react';

export function MainGame({ className, ...props }: ComponentProps<'div'>) {
	const { daily, dailyLoading, songs, club } = useClub();
	const { guesses } = useUser();

	return (
		<div
			className={cn(
				'flex flex-col items-center p-2 md:px-4 md:pt-4',
				className,
			)}
			{...props}>
			<div className='flex-1 flex flex-col gap-2 play-page-width'>
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
					className='play-page-width'
				/>
			)}

			<SongSelect
				songs={songs}
				correctSong={daily?.song}
				className='justify-self-end play-page-width'
			/>
			<AudioPlayer
				loading={dailyLoading}
				url={daily?.url}
				className='justify-self-end play-page-width'
			/>
		</div>
	);
}

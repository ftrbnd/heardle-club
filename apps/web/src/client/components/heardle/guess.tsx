'use client';

import { Check } from '@/server/components/icons/check';
import { Wrong } from '@/server/components/icons/wrong';
import { SelectBaseSong } from '@repo/database/postgres/schema';
import { Guess as GuessType } from '@repo/database/redis/schema';
import Image from 'next/image';

interface GuessComponentProps {
	guess: GuessType;
	song: SelectBaseSong;
}
export function Guess({ guess, song }: GuessComponentProps) {
	return (
		<div className='card card-side bg-base-200 shadow-xl max-h-[54px] play-page-width self-center'>
			<figure>
				<Image
					src={song.image ?? '/artist_placeholder.jpg'}
					alt={song.title}
					height={50}
					width={50}
				/>
			</figure>
			<div className='flex items-center w-full justify-between px-4'>
				<div
					className='tooltip'
					data-tip={`From: ${song.album}`}>
					<h2 className='card-title text-left'>{song.title}</h2>
				</div>
				<div
					className='tooltip tooltip-left'
					data-tip={getTooltip(guess)}>
					{guess.status === 'correct' ? (
						<Check />
					) : (
						<Wrong type={guess.status} />
					)}
				</div>
			</div>
		</div>
	);
}

const getTooltip = (guess: GuessType) => {
	switch (guess.status) {
		case 'correct':
			return 'You got it!';
		case 'album':
			return 'Same album...';
		case 'wrong':
			return 'Nope!';
	}
};

'use client';

import { Check } from '@/components/icons/check';
import { Wrong } from '@/components/icons/wrong';
import { cn } from '@/util';
import { SelectBaseSong } from '@repo/database/postgres/schema';
import { Guess as GuessType } from '@repo/database/redis/schema';
import Image from 'next/image';
import { ComponentProps } from 'react';

interface GuessComponentProps extends ComponentProps<'div'> {
	guess: GuessType;
	song?: SelectBaseSong;
}
export function Guess({
	guess,
	song,
	className,
	...props
}: GuessComponentProps) {
	return (
		<div
			{...props}
			className={cn(
				'card card-side bg-base-200 shadow-xl max-h-[54px] self-center',
				className
			)}>
			<figure>
				<Image
					src={song?.image ?? '/artist_placeholder.jpg'}
					alt={song ? song.title : 'Song not found'}
					height={50}
					width={50}
				/>
			</figure>
			<div className='flex items-center w-full justify-between px-4'>
				<div
					className='tooltip'
					data-tip={`From: ${song ? song.album : 'Unknown album'}`}>
					<h2 className='card-title text-left'>
						{song ? song.title : 'Unknown song'}
					</h2>
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

'use client';

import { Pause } from '@/components/icons/pause';
import { Play } from '@/components/icons/play';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/util';
import { completedHeardle, GUESS_LIMIT } from '@/util/game';
import { ComponentProps, useEffect, useRef, useState } from 'react';

interface AudioProps extends ComponentProps<'div'> {
	url?: string;
	loading: boolean;
}

export default function AudioPlayer({
	url,
	loading,
	className,
	...props
}: AudioProps) {
	const [second, setSecond] = useState(0);
	const [icon, setIcon] = useState<'play' | 'pause'>('play');
	const [error, setError] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const { guesses } = useUser();

	useEffect(() => {
		const handleTimeUpdate = () => {
			let currentSecond = 0;
			if (audioRef.current) {
				currentSecond = audioRef.current.currentTime;

				if (currentSecond >= GUESS_LIMIT) {
					pauseSong();
				}

				setSecond(audioRef.current.currentTime);
			}

			if (
				guesses &&
				currentSecond >= guesses.length + 1 &&
				!completedHeardle(guesses)
			) {
				pauseSong();
			}
		};

		const currentAudio = audioRef.current;
		if (currentAudio) currentAudio.volume = 0.5;
		currentAudio?.addEventListener('timeupdate', handleTimeUpdate);

		return () => {
			if (currentAudio) {
				currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
			}
		};
	});

	const pauseSong = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;

			setIcon('play');
		}
	};

	const playSong = async () => {
		if (audioRef.current) {
			audioRef.current.currentTime = 0;

			await audioRef.current.play();
			setIcon('pause');
		}
	};

	const togglePlayer = async () => {
		try {
			if (icon === 'play') await playSong();
			else pauseSong();
			setError('');
		} catch {
			setError('Failed to use audio player');
		}
	};

	return (
		<div
			{...props}
			className={cn(
				'flex flex-col items-center gap-2 play-page-width',
				className
			)}>
			<progress
				className='progress progress-primary'
				value={second}
				max={GUESS_LIMIT}></progress>
			{error && <p className='text-error'>{error}</p>}

			<div className='flex justify-between pt-2 w-full'>
				<kbd className='kbd'>
					00:{String(Math.floor(second)).padStart(2, '0')}
				</kbd>

				<button
					disabled={!url || loading}
					className='btn btn-ghost'
					onClick={togglePlayer}>
					{!url || loading ? (
						<span className='loading loading-spinner loading-xs md:loading-md'></span>
					) : icon === 'play' ? (
						<Play />
					) : (
						<Pause />
					)}
				</button>
				<kbd className='kbd'>00:0{GUESS_LIMIT}</kbd>
			</div>

			<audio
				ref={audioRef}
				className='hidden'
				src={url}
			/>
		</div>
	);
}

'use client';

import { Pause } from '@/server/components/icons/pause';
import { Play } from '@/server/components/icons/play';
import { useEffect, useRef, useState } from 'react';

interface AudioProps {
	url?: string;
}

export default function AudioPlayer({ url }: AudioProps) {
	const [second, setSecond] = useState(0);
	const [icon, setIcon] = useState<'play' | 'pause'>('play');
	const [error, setError] = useState('');
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		const handleTimeUpdate = () => {
			let currentSecond = 0;
			if (audioRef.current) {
				currentSecond = audioRef.current.currentTime;

				if (currentSecond >= 6) {
					pauseSong();
				}

				setSecond(audioRef.current.currentTime);
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
		<div className='flex flex-col items-center gap-2 w-full'>
			<progress
				className='progress progress-primary w-full md:w-3/5 xl:w-2/5'
				value={second}
				max='6'></progress>
			{error && <p className='text-error'>{error}</p>}

			<div className='flex justify-between pt-2 w-full md:w-3/5 xl:w-2/5'>
				<kbd className='kbd'>
					00:{String(Math.floor(second)).padStart(2, '0')}
				</kbd>

				<button
					className='btn btn-ghost'
					onClick={togglePlayer}>
					{icon === 'play' ? <Play /> : <Pause />}
				</button>
				<kbd className='kbd'>00:06</kbd>
			</div>

			<audio
				ref={audioRef}
				className='hidden'
				src={url}
			/>
		</div>
	);
}

'use client';

import { customToast } from '@/client/components/toast';
import { cn } from '@/lib/cn';
import { durationFormatted } from '@/lib/util';
import { Pause } from '@/server/components/icons/pause';
import { Play } from '@/server/components/icons/play';
import { SelectBaseSong } from '@repo/database/postgres';
import { ComponentProps, useEffect, useRef, useState } from 'react';

interface SongAudioProps extends ComponentProps<'div'> {
	song: SelectBaseSong;
}

export function SongAudio({ song, className, ...props }: SongAudioProps) {
	const [second, setSecond] = useState(0);
	const [icon, setIcon] = useState<'play' | 'pause'>('play');
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		const handleTimeUpdate = () => {
			if (audioRef.current) {
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
			setIcon('play');
		}
	};

	const playSong = async () => {
		if (audioRef.current) {
			await audioRef.current.play();
			setIcon('pause');
		}
	};

	const togglePlayer = async () => {
		console.log('toggle');
		try {
			if (icon === 'play') await playSong();
			else pauseSong();
		} catch {
			customToast({
				message: 'Failed to play audio',
				type: 'error',
			});
		}
	};

	return (
		<div
			onClick={togglePlayer}
			className={cn('btn btn-soft btn-primary join-item', className)}
			{...props}>
			<audio
				ref={audioRef}
				className='hidden'
				src={song.audio}
			/>
			{icon === 'play' ? <Play /> : <Pause />}
			{durationFormatted(second * 1000)}
		</div>
	);
}

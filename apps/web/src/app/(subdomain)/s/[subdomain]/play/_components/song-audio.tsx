'use client';

import { customToast } from '@/components/layout/toast';
import { cn, durationFormatted } from '@/util';
import { Pause } from '@/components/icons/pause';
import { Play } from '@/components/icons/play';
import { SelectBaseSong } from '@repo/database/postgres/schema';
import { ComponentProps, useRef, useState } from 'react';

interface SongAudioProps extends ComponentProps<'div'> {
	song: SelectBaseSong;
}

export function SongAudio({ song, className, ...props }: SongAudioProps) {
	const [second, setSecond] = useState(0);
	const [icon, setIcon] = useState<'play' | 'pause'>('play');
	const audioRef = useRef<HTMLAudioElement>(null);
	if (audioRef.current) audioRef.current.volume = 0.5;

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setSecond(audioRef.current.currentTime);

			if (audioRef.current.ended) {
				setIcon('play');
				audioRef.current.fastSeek(0);
			}
		}
	};

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

	const setPlaybackRate = async (playbackRate: number) => {
		if (audioRef.current) {
			audioRef.current.playbackRate = playbackRate;
		}
	};

	return (
		<div
			onClick={togglePlayer}
			onMouseDown={() => setPlaybackRate(2)}
			onMouseUp={() => setPlaybackRate(1)}
			className={cn('btn btn-soft btn-primary join-item', className)}
			{...props}>
			<audio
				onTimeUpdate={handleTimeUpdate}
				ref={audioRef}
				className='hidden'
				src={song.audio}
			/>
			{icon === 'play' ? <Play /> : <Pause />}
			{durationFormatted(second * 1000)}
		</div>
	);
}

'use client';

import { useUser } from '@/hooks/use-user';
import { cn } from '@/util';
import { SelectBaseSong } from '@repo/database/postgres/schema';
import { ChangeEvent, ComponentProps } from 'react';

interface SongSelectProps extends ComponentProps<'select'> {
	songs?: SelectBaseSong[];
	correctSong?: SelectBaseSong;
}

export function SongSelect({
	songs,
	correctSong,
	className,
	...props
}: SongSelectProps) {
	const { guesses, submitGuess } = useUser();

	const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
		if (
			event.target.className === 'default_selection' ||
			!songs ||
			!correctSong
		)
			return;
		const selectedSong = songs.find((song) => song.id === event.target.value);
		if (!selectedSong) return;

		const status =
			selectedSong.id === correctSong.id
				? 'correct'
				: selectedSong.album === correctSong.album
					? 'album'
					: 'wrong';

		await submitGuess({
			songId: selectedSong.id,
			status,
		});
	};

	const songsUnavailable = !songs || songs.length === 0;

	return (
		<select
			{...props}
			disabled={songsUnavailable}
			className={cn(
				'select select-primary play-page-width place-self-center',
				className
			)}
			defaultValue={'Choose a song!'}
			onChange={handleChange}>
			<option className='default_selection'>
				{songsUnavailable ? 'No songs found.' : 'Choose a song!'}
			</option>
			{songs?.map((song) => (
				<option
					disabled={guesses?.some((g) => g.songId === song.id)}
					key={song.id}
					value={song.id}>
					{song.title}
				</option>
			))}
		</select>
	);
}

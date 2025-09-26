'use client';

import { useUser } from '@/hooks/use-user';
import { SelectBaseSong } from '@repo/database/postgres/schema';
import { ChangeEvent } from 'react';

interface SongSelectProps {
	songs?: SelectBaseSong[];
	correctSong?: SelectBaseSong;
}

export function SongSelect({ songs, correctSong }: SongSelectProps) {
	const { submitGuess } = useUser();

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
	return (
		<select
			className='select select-primary play-page-width place-self-center'
			defaultValue={'Choose a song!'}
			onChange={handleChange}>
			<option className='default_selection'>Choose a song!</option>
			{songs?.map((song) => (
				<option
					key={song.id}
					value={song.id}>
					{song.title}
				</option>
			))}
		</select>
	);
}

'use client';

import { submitSongGuess } from '@/app/actions/db';
import { SelectBaseSong } from '@repo/database/postgres/schema';
import { ChangeEvent } from 'react';

interface SongSelectProps {
	songs?: SelectBaseSong[];
	correctSong?: SelectBaseSong;
}

export function SongSelect({ songs, correctSong }: SongSelectProps) {
	const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
		if (
			event.target.className === 'default_selection' ||
			!songs ||
			!correctSong
		)
			return;
		const selectedSong = songs.find((song) => song.id === event.target.value);
		if (!selectedSong) return;

		const isCorrect = selectedSong.id === correctSong.id;
		console.log({ isCorrect });

		await submitSongGuess({
			clubId: correctSong.clubId,
			guess: {
				songId: selectedSong.id,
				status: isCorrect ? 'correct' : 'wrong',
			},
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

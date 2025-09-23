'use client';

import { SelectBaseSong } from '@repo/database/postgres/schema';

interface SongSelectProps {
	songs?: SelectBaseSong[];
}

export function SongSelect({ songs }: SongSelectProps) {
	return (
		<select
			className='select select-primary play-page-width place-self-center'
			defaultValue={'Choose a song!'}>
			<option className='default_selection'>Choose a song!</option>
			{songs?.map((song) => (
				<option
					key={song.id}
					value={song.title}>
					{song.title}
				</option>
			))}
		</select>
	);
}

'use client';

import AudioPlayer from '@/app/(subdomain)/s/[subdomain]/play/_components/audio-player';
import { Guess } from '@/app/(subdomain)/s/[subdomain]/play/_components/guess';
import { SongSelect } from '@/app/(subdomain)/s/[subdomain]/play/_components/song-select';
import { useClub } from '@/hooks/use-club';
import { useUser } from '@/hooks/use-user';

export default function Page() {
	const { daily, songs } = useClub();
	const { guesses } = useUser();
	if (!songs || songs.length === 0) return <></>;

	return (
		<div className='flex-1 flex flex-col'>
			{guesses?.map((guess, index) => (
				<Guess
					key={index}
					guess={guess}
					song={songs[0]}
				/>
			))}

			<SongSelect
				songs={songs}
				correctSong={daily?.song}
			/>
			<AudioPlayer url={daily?.url} />
		</div>
	);
}

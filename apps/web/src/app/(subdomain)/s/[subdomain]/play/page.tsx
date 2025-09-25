'use client';

import AudioPlayer from '@/app/(subdomain)/s/[subdomain]/play/_components/audio-player';
import { SongSelect } from '@/app/(subdomain)/s/[subdomain]/play/_components/song-select';
import { useClub } from '@/hooks/use-club';

export default function Page() {
	const { daily, songs } = useClub();
	if (!songs || songs.length === 0) return <></>;

	return (
		<div className='flex-1 flex flex-col'>
			{/* <Guess
				guess={{
					songId: songs[0].id,
					status: 'album',
				}}
				song={songs[0]}
			/> */}
			<SongSelect
				songs={songs}
				correctSong={daily?.song}
			/>
			<AudioPlayer url={daily?.url} />
		</div>
	);
}

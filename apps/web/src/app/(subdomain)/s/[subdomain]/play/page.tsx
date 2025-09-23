'use client';

import AudioPlayer from '@/client/components/heardle/audio-player';
import { SongSelect } from '@/client/components/heardle/song-select';
import { useSubdomain } from '@/client/hooks/use-subdomain';

export default function Page() {
	const { daily, songs } = useSubdomain();

	return (
		<div className='flex-1 flex flex-col'>
			<SongSelect
				songs={songs}
				correctSong={daily?.song}
			/>
			<AudioPlayer url={daily?.url} />
		</div>
	);
}

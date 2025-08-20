'use client';

import AudioPlayer from '@/client/components/audio-player';
import { useSubdomain } from '@/client/hooks/use-subdomain';

export default function Page() {
	const { daily } = useSubdomain();

	return (
		<div className='flex-1'>
			<AudioPlayer url={daily?.url} />
		</div>
	);
}

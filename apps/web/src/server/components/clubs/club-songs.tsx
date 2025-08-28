import { ManageSong } from '@/client/components/clubs/manage-song';
import { Music } from '@/server/components/icons/music';
import { SelectBaseSong } from '@repo/database/postgres';
import Image from 'next/image';

export function ClubSongs({ songs }: { songs: SelectBaseSong[] }) {
	return (
		<ul className='list bg-base-100 rounded-box shadow-md'>
			{songs.map((song) => (
				<li
					key={song.id}
					className='list-row'>
					<div>
						{song.image ? (
							<Image
								className='size-10 rounded-box'
								src={song.image}
								alt={song.title}
								height={100}
								width={100}
							/>
						) : (
							<Music className='size-10 rounded-box' />
						)}
					</div>
					<div className='flex flex-col'>
						<p>{song.title}</p>
						<p className='text-xs uppercase font-semibold opacity-60'>
							{song.album}
						</p>
					</div>
					<ManageSong song={song} />
				</li>
			))}
		</ul>
	);
}

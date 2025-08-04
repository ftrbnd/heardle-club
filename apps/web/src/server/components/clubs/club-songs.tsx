import { Trash } from '@/server/components/icons/trash';
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
						<Image
							className='size-10 rounded-box'
							src={song.image ?? 'TODO:'}
							alt={song.title}
							height={100}
							width={100}
						/>
					</div>
					<div>
						<div>{song.title}</div>
						<div className='text-xs uppercase font-semibold opacity-60'>
							{song.album}
						</div>
					</div>
					<button className='btn btn-square btn-ghost'>
						<Trash />
					</button>
				</li>
			))}
		</ul>
	);
}

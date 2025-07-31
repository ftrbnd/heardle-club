import { Trash } from '@/components/icons/trash';
import { getClubSongs } from '@repo/database/api';
import { SelectClub } from '@repo/database/postgres';
import Image from 'next/image';

interface DashboardProps {
	club: SelectClub;
}

export async function Dashboard({ club }: DashboardProps) {
	const songs = await getClubSongs(club.id);

	return (
		<div>
			<ul className='list bg-base-100 rounded-box shadow-md'>
				<li className='p-4 pb-2 text-xs opacity-60 tracking-wide'>Songs</li>

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
		</div>
	);
}

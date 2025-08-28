import { ManageSong } from '@/client/components/clubs/manage-song';
import { durationFormatted } from '@/lib/util';
import { EllipsisVertical } from '@/server/components/icons/ellipsis-vertical';
import { Music } from '@/server/components/icons/music';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres';
import Image from 'next/image';

interface ClubSongsProps {
	club: SelectClub;
	songs: SelectBaseSong[];
}
export function ClubSongs({ club, songs }: ClubSongsProps) {
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

					<div className='flex items-center gap-2 md:gap-4'>
						<p className='font-mono'>
							{durationFormatted(song.duration * 1000)}
						</p>

						<div className='dropdown dropdown-left md:hidden'>
							<button
								tabIndex={0}
								role='button'
								className='btn btn-ghost rounded-field'>
								<EllipsisVertical />
							</button>
							<ul
								tabIndex={0}
								className='menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm'>
								<ManageSong
									club={club}
									song={song}
									orientation='vertical'
								/>
							</ul>
						</div>

						<ManageSong
							orientation='horizontal'
							className='hidden md:inline-flex'
							club={club}
							song={song}
						/>
					</div>
				</li>
			))}
		</ul>
	);
}

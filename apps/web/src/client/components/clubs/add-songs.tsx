'use client';

import { ArtistAlbums } from '@/client/components/clubs/artist-albums';
import { getArtistAlbums } from '@/server/actions/spotify';
import { Search } from '@/server/components/icons/search';
import { SelectClub } from '@repo/database/postgres';
import { useQuery } from '@tanstack/react-query';

export function AddSongs({ club }: { club: SelectClub }) {
	const { data: albums } = useQuery({
		queryKey: ['artist', 'albums', club.artistId],
		queryFn: () => getArtistAlbums(club.artistId),
	});

	return (
		<div className='p-2 flex flex-col w-full gap-4 items-center'>
			<div className='flex w-full gap-2 items-center justify-between'>
				<label className='input'>
					<Search />
					<input
						type='search'
						required
						placeholder='Search'
					/>
				</label>
				<button className='btn btn-primary self-start'>Add songs</button>
			</div>

			{albums && <ArtistAlbums albums={albums} />}
		</div>
	);
}

'use client';

import { AddSongsButton } from '@/client/components/clubs/add-songs-button';
import { ArtistAlbums } from '@/client/components/clubs/artist-albums';
import { submitClubSongs } from '@/server/actions/backend';
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
		<form
			action={submitClubSongs}
			className='p-2 flex flex-col w-full gap-4 items-center'>
			<div className='flex w-full gap-2 items-center justify-between'>
				<label className='input'>
					<Search />
					<input
						type='search'
						placeholder='Search'
					/>
				</label>
				<AddSongsButton />
			</div>

			{albums && <ArtistAlbums albums={albums} />}
		</form>
	);
}

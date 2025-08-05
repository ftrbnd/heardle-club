'use client';

import { clientGetArtistAlbums } from '@/app/spotify/_services';
import { AddSongsButton } from '@/client/components/clubs/add-songs-button';
import { ArtistAlbums } from '@/client/components/clubs/artist-albums';
import { submitClubSongs } from '@/server/actions/backend';
import { Search } from '@/server/components/icons/search';
import { SelectClub } from '@repo/database/postgres';
import { useQuery } from '@tanstack/react-query';

export function AddSongs({ club }: { club: SelectClub }) {
	const { data: albums } = useQuery({
		queryKey: ['artist', 'albums', club.artistId],
		queryFn: () => clientGetArtistAlbums(club.artistId),
	});

	const submitWithClubId = submitClubSongs.bind(null, club.id);

	return (
		<form
			action={submitWithClubId}
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

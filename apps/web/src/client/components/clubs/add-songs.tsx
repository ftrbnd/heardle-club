'use client';

import { clientGetClubDownloadStatus } from '@/app/api/clubs/services';
import { clientGetArtistAlbums } from '@/app/api/spotify/client.services';
import { AddSongsButton } from '@/client/components/clubs/add-songs-button';
import { ArtistAlbums } from '@/client/components/clubs/artist-albums';
import { CustomToast } from '@/client/components/toast';
import { submitClubSongs } from '@/server/actions/backend';
import { Search } from '@/server/components/icons/search';
import { SelectClub } from '@repo/database/postgres';
import { useQuery } from '@tanstack/react-query';

export function AddSongs({ club }: { club: SelectClub }) {
	const { data: albums } = useQuery({
		queryKey: ['artist', 'albums', club.artistId],
		queryFn: () => clientGetArtistAlbums(club.artistId),
	});

	// TODO: live update, stream/websocket?
	const { data: downloadStatus } = useQuery({
		queryKey: ['download-status', club.id],
		queryFn: () => clientGetClubDownloadStatus(club.id),
		staleTime: 0,
	});

	const submitWithClubId = submitClubSongs.bind(null, club.id);

	const [complete, total] = downloadStatus
		? downloadStatus.split('/')
		: ['0', '1'];
	const downloadComplete = complete === total;

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

			{downloadStatus && !downloadComplete && (
				<CustomToast
					message={`Downloading ${complete}/${total}...`}
					type='loading'
				/>
			)}

			{albums && <ArtistAlbums albums={albums} />}
		</form>
	);
}

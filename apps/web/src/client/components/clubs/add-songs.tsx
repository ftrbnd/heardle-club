'use client';

import { clientGetClubDownloadStatus } from '@/app/api/clubs/services';
import { clientGetArtistAlbums } from '@/app/api/spotify/client.services';
import { AddSongsButton } from '@/client/components/clubs/add-songs-button';
import { ArtistAlbums } from '@/client/components/clubs/artist-albums';
import { customToast } from '@/client/components/toast';
import { submitClubSongs } from '@/server/actions/backend';
import { Search } from '@/server/components/icons/search';
import { SelectClub } from '@repo/database/postgres';
import { useQuery } from '@tanstack/react-query';
import { useActionState, useEffect } from 'react';

export function AddSongs({ club }: { club: SelectClub }) {
	const { data: albums, isPending } = useQuery({
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

	const [state, formAction, actionIsPending] = useActionState(
		submitWithClubId,
		{ error: undefined, success: false }
	);

	useEffect(() => {
		if (actionIsPending) {
			customToast({
				message: 'Submitting songs...',
				type: 'loading',
			});
		} else if (downloadStatus) {
			const [complete, total] = downloadStatus
				? downloadStatus.split('/')
				: ['0', '1'];
			const downloadComplete = complete === total;
			if (downloadComplete) {
				customToast({
					message: `Downloading ${complete}/${total}...`,
					type: 'loading',
				});
			}
		} else if (state.error) {
			customToast({
				message: state.error,
				type: 'error',
			});
		} else if (state.success) {
			customToast({
				message: 'Songs submitted successfully!',
				type: 'success',
			});
		}
	}, [actionIsPending, state, downloadStatus]);

	return (
		<form
			action={formAction}
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

			<ArtistAlbums
				albums={albums}
				isPending={isPending}
			/>
		</form>
	);
}

'use client';

import { clientGetClubDownloadStatus } from '@/app/api/clubs/services';
import { clientGetArtistAlbums } from '@/app/api/spotify/client.services';
import { ArtistAlbums } from '@/client/components/clubs/artist-albums';
import { UploadModal } from '@/client/components/clubs/upload-modal';
import { customToast } from '@/client/components/toast';
import { submitClubSongs } from '@/server/actions/backend';
import { Search } from '@/server/components/icons/search';
import { Upload } from '@/server/components/icons/upload';
import { SelectClub } from '@repo/database/postgres';
import { useQuery } from '@tanstack/react-query';
import { useActionState, useEffect, useState } from 'react';

export function AddSongs({ club }: { club: SelectClub }) {
	const [selectedAmt, setSelectedAmt] = useState(0);

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
		<div className='p-2 flex flex-col w-full gap-4 items-center'>
			<div className='flex w-full gap-2 items-center justify-between'>
				<label className='input'>
					<Search />
					<input
						type='search'
						placeholder='Search'
					/>
					{/* TODO: filter songs by search */}
				</label>

				<div className='flex items-center'>
					<UploadModal
						modalId={`club_${club.id}_upload_modal`}
						club={club}
						btnLabel='Upload'
						formTitle='Upload a custom file'
					/>
				</div>
			</div>

			<form
				action={formAction}
				className='w-full flex flex-col'>
				<button
					type='submit'
					disabled={actionIsPending || selectedAmt === 0}
					className='btn btn-primary self-end'>
					<Upload />
					Add songs
				</button>
				<ArtistAlbums
					albums={albums}
					isPending={isPending}
					setSelectedAmt={setSelectedAmt}
				/>
			</form>
		</div>
	);
}

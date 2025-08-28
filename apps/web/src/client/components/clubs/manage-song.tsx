'use client';

import { UploadModal } from '@/client/components/clubs/upload-modal';
import { customToast } from '@/client/components/toast';
import { deleteSong } from '@/server/actions/db';
import { Trash } from '@/server/components/icons/trash';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres';
import { useActionState, useEffect } from 'react';

interface ManageSongProps {
	club: SelectClub;
	song: SelectBaseSong;
}

export function ManageSong({ club, song }: ManageSongProps) {
	const deleteWithSong = deleteSong.bind(null, song);

	const [deleteState, deleteAction, deleteActionIsPending] = useActionState(
		deleteWithSong,
		{
			error: undefined,
			success: false,
		}
	);

	useEffect(() => {
		if (deleteActionIsPending) {
			customToast({
				message: 'Deleting song...',
				type: 'loading',
			});
		} else if (deleteState.error) {
			customToast({
				message: deleteState.error,
				type: 'error',
			});
		} else if (deleteState.success) {
			customToast({
				message: 'Song deleted successfully!',
				type: 'success',
			});
		}
	}, [deleteActionIsPending, deleteState.error, deleteState.success]);

	return (
		<div className='join'>
			<UploadModal
				modalId={`replace_${song.id}_modal`}
				club={club}
				btnLabel='Replace'
				btnClassName='btn-secondary'
				formTitle={`Replace audio for ${song.title}`}
				replaceOptions={{ song }}
			/>
			<form action={deleteAction}>
				<button
					// TODO: add modal
					type='submit'
					disabled={deleteActionIsPending}
					className='btn btn-error join-item'>
					<Trash />
					Delete
				</button>
			</form>
		</div>
	);
}

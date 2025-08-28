'use client';

import { customToast } from '@/client/components/toast';
import { deleteSong } from '@/server/actions/db';
import { FileUp } from '@/server/components/icons/file-up';
import { Trash } from '@/server/components/icons/trash';
import { SelectBaseSong } from '@repo/database/postgres';
import { useActionState, useEffect } from 'react';

interface ManageSongProps {
	song: SelectBaseSong;
}

export function ManageSong({ song }: ManageSongProps) {
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
		<form className='join'>
			<button
				disabled={deleteActionIsPending}
				className='btn btn-secondary join-item'>
				<FileUp />
				Replace
			</button>
			<button
				// TODO: add modal
				disabled={deleteActionIsPending}
				formAction={deleteAction}
				className='btn btn-error join-item'>
				<Trash />
				Delete
			</button>
		</form>
	);
}

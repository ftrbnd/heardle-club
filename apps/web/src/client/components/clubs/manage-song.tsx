'use client';

import { UploadModal } from '@/client/components/clubs/upload-modal';
import { customToast } from '@/client/components/toast';
import { cn } from '@/lib/cn';
import { deleteSong } from '@/server/actions/db';
import { Trash } from '@/server/components/icons/trash';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres';
import { ComponentProps, useActionState, useEffect } from 'react';

interface ManageSongProps extends ComponentProps<'div'> {
	club: SelectClub;
	song: SelectBaseSong;
	orientation: 'horizontal' | 'vertical';
}

export function ManageSong({
	club,
	song,
	className,
	orientation,
	...props
}: ManageSongProps) {
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
		<div
			className={cn(
				'join ',
				orientation === 'vertical' ? 'join-vertical' : 'join-horizontal',
				className
			)}
			{...props}>
			<UploadModal
				modalId={`replace_${song.id}_modal`}
				club={club}
				btnLabel='Replace'
				btnClassName={cn(
					'btn-secondary join-item',
					orientation === 'vertical' && 'btn-soft'
				)}
				formTitle={`Replace audio for ${song.title}`}
				replaceOptions={{ song }}
				orientation={orientation}
			/>
			<form action={deleteAction}>
				<button
					// TODO: add modal
					type='submit'
					disabled={deleteActionIsPending}
					className={cn(
						'btn btn-error join-item max-sm:w-full',
						orientation === 'vertical' && 'btn-soft'
					)}>
					<Trash />
					Delete
				</button>
			</form>
		</div>
	);
}

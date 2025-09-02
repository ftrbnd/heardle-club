'use client';

import { UploadModal } from '@/client/components/clubs/upload-modal';
import { SongAudio } from '@/client/components/song-audio';
import { useToastActionState } from '@/client/hooks/use-toast-action-state';
import { cn } from '@/lib/cn';
import { deleteSong } from '@/server/actions/db';
import { Trash } from '@/server/components/icons/trash';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres';
import { ComponentProps } from 'react';

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
	const { formAction, actionIsPending } = useToastActionState({
		action: deleteWithSong,
		pendingMessage: `Deleting ${song.title}...`,
		successMessage: `Deleted ${song.title}`,
	});

	return (
		<div
			className={cn(
				'join ',
				orientation === 'vertical' ? 'join-vertical' : 'join-horizontal',
				className
			)}
			{...props}>
			<SongAudio song={song} />

			<UploadModal
				modalId={`edit_${song.id}_modal`}
				club={club}
				btnLabel='Edit'
				btnClassName={cn('btn-secondary btn-soft join-item')}
				formTitle={`Edit ${song.title}`}
				editOptions={{ song }}
			/>
			<form action={formAction}>
				<button
					// TODO: add modal
					type='submit'
					disabled={actionIsPending}
					className={cn('btn btn-soft btn-error join-item max-sm:w-full')}>
					<Trash />
					Delete
				</button>
			</form>
		</div>
	);
}

'use client';

import { SongUploadForm } from '@/components/clubs/songs/song-upload-form';
import { Portal } from '@/components/layout/portal';
import { cn } from '@/util';
import { FileAudio } from '@/components/icons/file-audio';
import { SquarePen } from '@/components/icons/square-pen';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres/schema';
import { MouseEvent } from 'react';

interface SongUploadModalProps {
	modalId: string;
	btnLabel: 'Edit' | 'Upload';
	btnClassName?: string;
	formTitle: string;
	club: SelectClub;
	editOptions?: {
		song: SelectBaseSong;
	};
}

export function SongUploadModal({
	modalId,
	club,
	btnLabel,
	btnClassName,
	formTitle,
	editOptions,
}: SongUploadModalProps) {
	const openModal = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (!modal) return;

		modal.showModal();
	};

	const closeModal = () => {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (!modal) return;

		if (modal.open) modal.close();
	};

	return (
		<>
			<button
				className={cn('btn', btnClassName)}
				onClick={openModal}>
				{btnLabel === 'Edit' ? <SquarePen /> : <FileAudio />}
				{btnLabel}
			</button>
			<Portal selector='portal-container'>
				<dialog
					id={modalId}
					className='modal modal-bottom sm:modal-middle'>
					<div className='modal-box'>
						<h3 className='font-bold text-lg'>{formTitle}</h3>
						<SongUploadForm
							club={club}
							songBeingEdited={editOptions?.song}
							onSuccess={closeModal}
						/>
					</div>
					<form
						method='dialog'
						className='modal-backdrop'>
						<button>Close</button>
					</form>
				</dialog>
			</Portal>
		</>
	);
}

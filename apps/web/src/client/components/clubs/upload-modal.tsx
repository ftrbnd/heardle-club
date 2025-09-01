'use client';

import { UploadForm } from '@/client/components/clubs/upload-form';
import { cn } from '@/lib/cn';
import { FileAudio } from '@/server/components/icons/file-audio';
import { SquarePen } from '@/server/components/icons/square-pen';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres';
import { MouseEvent } from 'react';
import { createPortal } from 'react-dom';

interface UploadModalProps {
	modalId: string;
	btnLabel: 'Edit' | 'Upload';
	btnClassName?: string;
	formTitle: string;
	club: SelectClub;
	editOptions?: {
		song: SelectBaseSong;
	};
	orientation: 'horizontal' | 'vertical';
}

export function UploadModal({
	modalId,
	club,
	btnLabel,
	btnClassName,
	formTitle,
	editOptions,
}: UploadModalProps) {
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
			{createPortal(
				<dialog
					id={modalId}
					className='modal modal-bottom sm:modal-middle'>
					<div className='modal-box'>
						<h3 className='font-bold text-lg'>{formTitle}</h3>
						<UploadForm
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
				</dialog>,
				// TODO: fix hydration error
				document?.body
			)}
		</>
	);
}

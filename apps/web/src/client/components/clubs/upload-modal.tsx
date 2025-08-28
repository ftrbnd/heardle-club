'use client';

import { UploadForm } from '@/client/components/clubs/upload-form';
import { cn } from '@/lib/cn';
import { FileAudio } from '@/server/components/icons/file-audio';
import { SelectClub } from '@repo/database/postgres';
import { MouseEvent } from 'react';

interface UploadModalProps {
	modalId: string;
	club: SelectClub;
	btnLabel: string;
	btnClassName?: string;
	formTitle: string;
}

/* TODO: add type: 'upload' | 'replace' prop
	fill in form fields if replacing
	adjust uploadAction if replacing
*/
export function UploadModal({
	modalId,
	club,
	btnLabel,
	btnClassName,
	formTitle,
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
		<div>
			<button
				className={cn('btn btn-accent', btnClassName)}
				onClick={openModal}>
				<FileAudio />
				{btnLabel}
			</button>
			<dialog
				id={modalId}
				className='modal modal-bottom sm:modal-middle'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg'>{formTitle}</h3>
					<UploadForm
						club={club}
						onSuccess={closeModal}
					/>
				</div>
				<form
					method='dialog'
					className='modal-backdrop'>
					<button>Close</button>
				</form>
			</dialog>
		</div>
	);
}

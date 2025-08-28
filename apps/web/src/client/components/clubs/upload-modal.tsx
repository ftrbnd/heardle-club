'use client';

import { UploadForm } from '@/client/components/clubs/upload-form';
import { cn } from '@/lib/cn';
import { FileAudio } from '@/server/components/icons/file-audio';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres';
import { MouseEvent } from 'react';
import { createPortal } from 'react-dom';

interface UploadModalProps {
	modalId: string;
	btnLabel: string;
	btnClassName?: string;
	formTitle: string;
	club: SelectClub;
	replaceOptions?: {
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
	replaceOptions,
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
				<FileAudio />
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
							songBeingReplaced={replaceOptions?.song}
							onSuccess={closeModal}
						/>
					</div>
					<form
						method='dialog'
						className='modal-backdrop'>
						<button>Close</button>
					</form>
				</dialog>,
				document?.body
			)}
		</>
	);
}

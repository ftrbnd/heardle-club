'use client';

import { UploadForm } from '@/client/components/clubs/upload-form';
import { FileAudio } from '@/server/components/icons/file-audio';
import { SelectClub } from '@repo/database/postgres';
import { MouseEvent } from 'react';

interface UploadModalProps {
	club: SelectClub;
}

export function UploadModal({ club }: UploadModalProps) {
	const openModal = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const modal = document.getElementById('upload_modal') as HTMLDialogElement;
		if (!modal) return;

		modal.showModal();
	};

	const closeModal = () => {
		const modal = document.getElementById('upload_modal') as HTMLDialogElement;
		if (!modal) return;

		if (modal.open) modal.close();
	};

	return (
		<div>
			<button
				className='btn btn-accent'
				onClick={openModal}>
				<FileAudio />
				Upload
			</button>
			<dialog
				id='upload_modal'
				className='modal modal-bottom sm:modal-middle'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg'>Upload a custom file</h3>
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

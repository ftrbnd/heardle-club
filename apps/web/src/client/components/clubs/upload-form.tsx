'use client';

import { customToast } from '@/client/components/toast';
import { uploadSongFiles } from '@/server/actions/db';
import { SelectClub } from '@repo/database/postgres';
import { useActionState, useEffect } from 'react';

interface UploadFormProps {
	club: SelectClub;
}

export function UploadForm({ club }: UploadFormProps) {
	const uploadWithClubId = uploadSongFiles.bind(null, club.id);

	const [state, formAction, actionIsPending] = useActionState(
		uploadWithClubId,
		{
			error: undefined,
			success: false,
		}
	);

	useEffect(() => {
		if (actionIsPending) {
			customToast({
				message: 'Uploading file...',
				type: 'loading',
			});
		} else if (state.error) {
			customToast({
				message: state.error,
				type: 'error',
			});
		} else if (state.success) {
			customToast({
				message: 'File uploaded successfully!',
				type: 'success',
			});
		}
	}, [actionIsPending, state.error, state.success]);

	return (
		<form
			action={formAction}
			className='flex flex-col items-center'>
			<fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-full border p-4'>
				<legend className='fieldset-legend'>Song details</legend>

				<label className='label'>Title</label>
				<input
					type='text'
					className='input w-full'
					name='title'
				/>

				<label className='label'>Artist</label>
				<input
					type='text'
					className='input w-full'
					name='artist'
				/>

				<label className='label'>Album</label>
				<input
					type='text'
					className='input w-full'
					name='album'
				/>
			</fieldset>

			<fieldset className='fieldset'>
				<legend className='fieldset-legend'>Pick a file</legend>
				<input
					type='file'
					className='file-input'
					name='audio_file'
					accept='audio/mp3'
				/>
				<label className='label'>Max size 5MB</label>
			</fieldset>

			<button
				disabled={actionIsPending}
				className='btn btn-primary'
				type='submit'>
				Submit
			</button>
		</form>
	);
}

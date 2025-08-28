'use client';

import { customToast } from '@/client/components/toast';
import { uploadSongFiles } from '@/server/actions/db';
import { SelectClub } from '@repo/database/postgres';
import { ChangeEvent, useActionState, useEffect, useState } from 'react';

interface UploadFormProps {
	club: SelectClub;
	onSuccess: () => void;
}

export function UploadForm({ club, onSuccess }: UploadFormProps) {
	const [audioDuration, setAudioDuration] = useState(0);

	const uploadWithClubId = uploadSongFiles.bind(null, {
		clubId: club.id,
		duration: Math.floor(audioDuration),
	});
	const [state, formAction, actionIsPending] = useActionState(
		uploadWithClubId,
		{
			error: undefined,
			success: false,
		}
	);

	const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			const audio = new Audio();
			audio.src = URL.createObjectURL(file);

			audio.addEventListener('loadedmetadata', () => {
				setAudioDuration(audio.duration);

				URL.revokeObjectURL(audio.src);
			});
		}
	};

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
			onSuccess();
			customToast({
				message: 'File uploaded successfully!',
				type: 'success',
			});
		}
	}, [actionIsPending, onSuccess, state.error, state.success]);

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
					onChange={handleAudioChange}
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

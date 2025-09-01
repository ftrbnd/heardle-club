'use client';

import { customToast } from '@/client/components/toast';
import { updateSongDuration, uploadSongFile } from '@/server/actions/db';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres';
import { ChangeEvent, useActionState, useEffect, useState } from 'react';

interface UploadFormProps {
	club: SelectClub;
	songBeingEdited?: SelectBaseSong;
	onSuccess: () => void;
}

export function UploadForm({
	club,
	songBeingEdited,
	onSuccess,
}: UploadFormProps) {
	const [audioDuration, setAudioDuration] = useState(
		songBeingEdited?.duration ?? 0
	);

	const uploadWithClubId = uploadSongFile.bind(null, {
		clubId: club.id,
		duration: Math.floor(audioDuration),
		originalSong: songBeingEdited,
	});
	const [uploadState, uploadFormAction, uploadActionIsPending] = useActionState(
		uploadWithClubId,
		{
			error: undefined,
			success: false,
		}
	);

	const updateWithSong = updateSongDuration.bind(null, {
		song: songBeingEdited,
		duration: audioDuration,
	});

	const [durationState, durationFormAction, durationActionIsPending] =
		useActionState(updateWithSong, {
			error: undefined,
			success: false,
		});

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
		if (uploadActionIsPending || durationActionIsPending) {
			customToast({
				message: uploadActionIsPending ? 'Uploading file...' : 'Saving...',
				type: 'loading',
			});
		} else if (uploadState.error || durationState.error) {
			customToast({
				message: uploadState.error || durationState.error || 'Error',
				type: 'error',
			});
		} else if (uploadState.success || durationState.success) {
			onSuccess();
			customToast({
				message: uploadState.success
					? 'File uploaded successfully!'
					: 'Duration updated',
				type: 'success',
			});
		}
	}, [
		uploadActionIsPending,
		onSuccess,
		uploadState.error,
		uploadState.success,
		durationActionIsPending,
		durationState.error,
		durationState.success,
	]);

	return (
		<div className='flex flex-col items-center gap-2'>
			<fieldset className='fieldset flex flex-col bg-base-200 border-base-300 rounded-box w-full border p-4'>
				<legend className='fieldset-legend'>Song details</legend>
				{songBeingEdited ? (
					<form
						action={durationFormAction}
						className='flex items-center justify-between gap-2'>
						<div>
							<label className='label'>Duration</label>
							<input
								type='number'
								className='appearance-none input w-full'
								name='duration'
								value={audioDuration}
								onChange={(e) => {
									if (e.target.value)
										setAudioDuration(parseInt(e.target.value));
									else setAudioDuration(0);
								}}
							/>
						</div>

						<button
							disabled={uploadActionIsPending || durationActionIsPending}
							className='btn btn-secondary self-end'>
							Save
						</button>
					</form>
				) : (
					<>
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
					</>
				)}
			</fieldset>

			<form action={uploadFormAction}>
				<fieldset className='fieldset flex items-center'>
					<div>
						<legend className='fieldset-legend'>Pick a file</legend>
						<input
							type='file'
							className='file-input'
							name='audio_file'
							accept='audio/mp3'
							onChange={handleAudioChange}
						/>
						<label className='label'>Max size 5MB</label>
					</div>

					<button
						disabled={uploadActionIsPending || durationActionIsPending}
						className='btn btn-primary self-end'
						type='submit'>
						Upload
					</button>
				</fieldset>
			</form>
		</div>
	);
}

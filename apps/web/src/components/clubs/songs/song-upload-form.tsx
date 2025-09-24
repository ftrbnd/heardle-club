'use client';

import { useToastActionState } from '@/hooks/use-toast-action-state';
import { updateSongDuration, uploadSongFile } from '@/app/actions/db';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres/schema';
import { ChangeEvent, useEffect, useState } from 'react';

interface UploadFormProps {
	club: SelectClub;
	songBeingEdited?: SelectBaseSong;
	onSuccess: () => void;
}

export function SongUploadForm({
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
	const {
		formAction: uploadFormAction,
		actionIsPending: uploadActionIsPending,
		state: uploadState,
	} = useToastActionState({
		action: uploadWithClubId,
		pendingMessage: 'Uploading file...',
		successMessage: 'File uploaded successfully!',
	});

	const updateWithSong = updateSongDuration.bind(null, {
		song: songBeingEdited,
		duration: audioDuration,
	});
	const {
		formAction: durationFormAction,
		actionIsPending: durationActionIsPending,
		state: durationState,
	} = useToastActionState({
		action: updateWithSong,
		pendingMessage: 'Saving...',
		successMessage: 'Duration updated',
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
		if (uploadState.success || durationState.success) {
			onSuccess();
		}
	}, [uploadState.success, durationState.success, onSuccess]);

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

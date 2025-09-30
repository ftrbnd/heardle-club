'use client';

import { useToastActionState } from '@/hooks/use-toast-action-state';
import { updateSongDuration, uploadSongFile } from '@/app/actions/db';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres/schema';
import { ChangeEvent, useEffect, useState } from 'react';
import { SingleSongFields } from '@/components/clubs/songs/single-song-fields';
import { cn } from '@/util';

interface UploadFormProps {
	club: SelectClub;
	songBeingEdited?: SelectBaseSong;
	onSuccess: () => void;
}

interface FileAndIndex {
	file: File | null;
	index: number;
}

export function SongUploadForm({
	club,
	songBeingEdited,
	onSuccess,
}: UploadFormProps) {
	const [audioDuration, setAudioDuration] = useState(
		songBeingEdited?.duration ?? 0
	);
	const [files, setFiles] = useState<FileList | null>(null);
	const [selectedFile, setSelectedFile] = useState<FileAndIndex | null>(null);

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
		const files = e.target.files;
		if (files) {
			setFiles(files);
			setSelectedFile({
				file: files.item(0),
				index: 0,
			});
		}
	};

	useEffect(() => {
		if (uploadState.success || durationState.success) {
			onSuccess();
		}
	}, [uploadState.success, durationState.success, onSuccess]);

	return (
		<form className='flex flex-col items-center gap-2'>
			<fieldset className='fieldset flex flex-col bg-base-200 border-base-300 rounded-box w-full border p-4'>
				<legend className='fieldset-legend'>Song details</legend>

				{files && selectedFile?.file ? (
					<div className='flex flex-col gap-2 w-full'>
						<SingleSongFields file={selectedFile.file} />
						<div className='join self-center'>
							{new Array(files.length).fill(0).map((value, i) => (
								<button
									type='button'
									onClick={() =>
										setSelectedFile({
											file: files.item(i),
											index: i,
										})
									}
									key={i}
									className={cn(
										'join-item btn',
										selectedFile.index === i && 'btn-active'
									)}>
									{i + 1}
								</button>
							))}
						</div>
					</div>
				) : (
					<UploadInput onChange={handleAudioChange} />
				)}

				<button
					disabled={
						!files ||
						files.length === 0 ||
						uploadActionIsPending ||
						durationActionIsPending
					}
					className='btn btn-neutral mt-4'>
					Upload {files?.length} file{files && files.length > 1 ? 's' : ''}
				</button>
			</fieldset>
		</form>
	);
}

interface UploadInputProps {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
function UploadInput({ onChange }: UploadInputProps) {
	return (
		<fieldset className='fieldset flex items-center'>
			<legend className='fieldset-legend'>Pick a file</legend>
			<input
				type='file'
				className='file-input'
				name='audio_file'
				accept='audio/mp3'
				multiple
				onChange={onChange}
			/>
			<label className='label'>Max size 5MB</label>
		</fieldset>
	);
}

'use client';

import { useToastActionState } from '@/hooks/use-toast-action-state';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres/schema';
import { ChangeEvent, useEffect, useState } from 'react';
import { SingleSongFields } from '@/components/clubs/songs/single-song-fields';
import { cn } from '@/util';
import { uploadSongFiles } from '@/app/actions/db';
import { customToast } from '@/components/layout/toast';

interface UploadFormProps {
	club: SelectClub;
	onSuccess: () => void;
}

export type SongMetadata = Partial<
	Pick<SelectBaseSong, 'title' | 'artist' | 'album' | 'duration'>
> & {
	picture: string | null;
	/**
	 * used to cross-match a File and SongMetadata object when uploading
	 */
	fileName: string;
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB in bytes

const isPlural = (amount: number) => amount > 1 || amount === 0;

export function SongUploadForm({ club, onSuccess }: UploadFormProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

	const [metadataFiles, setMetadataFiles] = useState<(SongMetadata | null)[]>(
		[]
	);
	const selectedFile = files.at(selectedFileIndex);
	const filePlural = (amount: number) => (isPlural(amount) ? 'files' : 'file');

	const handleAudioChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const submittedFiles = e.target.files;
		if (submittedFiles) {
			const filesUnderSizeLimit = [...submittedFiles].filter(
				(file) => file.size < MAX_FILE_SIZE_BYTES
			);
			setFiles(filesUnderSizeLimit);
			setMetadataFiles(new Array(filesUnderSizeLimit.length).fill(null));

			const filesOverSizeLimit =
				submittedFiles.length - filesUnderSizeLimit.length;
			if (filesOverSizeLimit > 0) {
				const wereWas = isPlural(filesOverSizeLimit) ? 'were' : 'was';

				customToast({
					message: `${filesOverSizeLimit} ${filePlural(filesOverSizeLimit)} out of ${submittedFiles.length}  ${wereWas} over the limit of 10MB.`,
					type: 'warning',
				});
			}
		}
	};

	const handleSubmit = async () => {
		// TODO: catch silent error; files aren't being uploaded
		// is the total file size being counted as one for this server action?
		// alternative: send files to elysia server
		// TODO: add resumable uploads with tus-js-client
		try {
			await uploadSongFiles({
				clubId: club.id,
				files,
				metadataFiles,
			});

			return { success: true };
		} catch (error) {
			console.error(error);
			return {
				error:
					error instanceof Error
						? error.message
						: `${files.length} ${filePlural(files.length)} failed to upload`,
			};
		}
	};

	const updateMetadata = (metadata: SongMetadata) => {
		setMetadataFiles((prev) => {
			const copy = [...prev];
			copy[selectedFileIndex] = metadata;
			return copy;
		});
	};

	const handleReset = () => {
		setFiles([]);
		setMetadataFiles([]);
	};

	const {
		formAction: uploadFormAction,
		actionIsPending: uploadActionIsPending,
		state: uploadState,
	} = useToastActionState({
		action: handleSubmit,
		pendingMessage: `Uploading ${files.length} ${filePlural(files.length)}...`,
		successMessage: `${files.length} ${filePlural(files.length)} uploaded successfully!`,
	});

	useEffect(() => {
		if (uploadState.success) {
			onSuccess();
		}
	}, [uploadState.success, onSuccess]);

	return (
		<form
			action={uploadFormAction}
			className='flex flex-col items-center gap-2'>
			<fieldset className='fieldset flex flex-col bg-base-200 border-base-300 rounded-box w-full border p-4'>
				<legend className='fieldset-legend'>Song details</legend>

				{files.length > 0 ? (
					<div className='flex flex-col gap-2 w-full'>
						{selectedFile && (
							<SingleSongFields
								file={selectedFile}
								setMetadata={updateMetadata}
							/>
						)}

						{files.length > 1 && (
							<div className='join self-center'>
								{new Array(files.length).fill(0).map((_value, i) => (
									<button
										type='button'
										onClick={() => setSelectedFileIndex(i)}
										key={i}
										className={cn(
											'join-item btn',
											selectedFileIndex === i && 'btn-active'
										)}>
										{i + 1}
									</button>
								))}
							</div>
						)}
					</div>
				) : (
					<UploadInput onChange={handleAudioChange} />
				)}

				<div className='self-center w-full flex gap-2'>
					<button
						onClick={handleReset}
						type='button'
						disabled={!files || files.length === 0 || uploadActionIsPending}
						className='btn btn-soft btn-error mt-4 flex-1'>
						Reset
					</button>
					<button
						type='submit'
						disabled={!files || files.length === 0 || uploadActionIsPending}
						className='btn btn-soft btn-primary mt-4 flex-1'>
						Upload {files?.length} {filePlural(files.length)}
					</button>
				</div>
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
			<label className='label'>Max size 10MB</label>
		</fieldset>
	);
}

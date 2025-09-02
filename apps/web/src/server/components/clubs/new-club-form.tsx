'use client';

import { customToast } from '@/client/components/toast';
import { createClub } from '@/server/actions/db';
import { Artist } from '@spotify/web-api-ts-sdk';
import { useActionState, useEffect } from 'react';

interface NewClubFormProps {
	artist: Artist;
	clubAlreadyExists: boolean;
}

export function NewClubForm({ artist, clubAlreadyExists }: NewClubFormProps) {
	const formDisabled = clubAlreadyExists;
	const createClubWithArtistId = createClub.bind(null, artist.id);

	const [state, formAction, actionIsPending] = useActionState(
		createClubWithArtistId,
		{
			error: undefined,
			success: false,
		}
	);

	useEffect(() => {
		if (actionIsPending) {
			customToast({
				message: 'Creating club...',
				type: 'loading',
			});
		} else if (state.error) {
			customToast({
				message: state.error,
				type: 'error',
			});
		} else if (state.success) {
			customToast({
				message: 'Successfully created your club!',
				type: 'success',
			});
		}
	}, [actionIsPending, state]);

	return (
		<form
			className='w-full'
			action={formAction}>
			<fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 '>
				<legend className='fieldset-legend'>Club details</legend>

				<label
					htmlFor='subdomain'
					className='label'>
					Subdomain
				</label>
				<input
					name='subdomain'
					disabled={formDisabled}
					type='text'
					className='input w-full'
					placeholder='[subdomain].heardle.club'
				/>

				<label
					htmlFor='displayName'
					className='label'>
					Display name
				</label>
				<input
					name='displayName'
					disabled={formDisabled}
					type='text'
					className='input w-full'
					placeholder={artist.name}
				/>

				<label
					htmlFor='image'
					className='label'>
					Image (Max size 2MB)
				</label>
				<input
					name='image'
					disabled={formDisabled}
					type='file'
					className='file-input'
				/>
			</fieldset>

			<div className='card-actions justify-end'>
				<button
					type='submit'
					disabled={formDisabled}
					className='btn btn-primary'>
					Submit
				</button>
			</div>
		</form>
	);
}

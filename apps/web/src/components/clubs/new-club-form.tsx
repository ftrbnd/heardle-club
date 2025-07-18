import { getCurrentUser } from '@/actions/auth';
import { createClub } from '@/actions/db';
import { Artist } from '@spotify/web-api-ts-sdk';

interface NewClubFormProps {
	artist: Artist;
	clubAlreadyExists: boolean;
}

export async function NewClubForm({
	artist,
	clubAlreadyExists,
}: NewClubFormProps) {
	const user = await getCurrentUser();

	const updateUserWithIds = createClub.bind(null, {
		artistId: artist.id,
		ownerId: user?.id,
	});

	const formDisabled = clubAlreadyExists || !user;

	return (
		<form
			className='w-full'
			action={updateUserWithIds}>
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

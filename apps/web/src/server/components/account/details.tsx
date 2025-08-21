'use client';

import { User } from '@/app/api/auth/_user';
import { customToast } from '@/client/components/toast';
import { updateAccountDetails } from '@/server/actions/db';
import { UserAvatar } from '@/server/components/account/avatar';
import { useActionState, useEffect } from 'react';

interface AccountDetailsProps {
	user: User;
}

export function AccountDetails({ user }: AccountDetailsProps) {
	const [state, formAction, actionIsPending] = useActionState(
		updateAccountDetails,
		{ error: undefined, success: false }
	);

	useEffect(() => {
		if (actionIsPending) {
			customToast({
				message: 'Updating profile...',
				type: 'loading',
			});
		} else if (state.error) {
			customToast({
				message: state.error,
				type: 'error',
			});
		} else if (state.success) {
			customToast({
				message: 'Updated profile!',
				type: 'success',
			});
		}
	}, [state, actionIsPending]);

	return (
		<div className='place-self-center card lg:card-side bg-base-100 shadow-sm md:mx-16'>
			<figure>
				<UserAvatar
					user={user}
					className='rounded-md'
				/>
			</figure>
			<div className='card-body'>
				<h2 className='card-title'>Account Details</h2>
				<form action={formAction}>
					<fieldset className='fieldset'>
						<legend className='fieldset-legend'>Display name</legend>
						<input
							type='text'
							className='input'
							placeholder='Display name'
							name='displayName'
							defaultValue={user.displayName ?? undefined}
						/>
					</fieldset>
					<fieldset className='fieldset'>
						<legend className='fieldset-legend'>Avatar</legend>
						<input
							type='file'
							accept='image/png, image/jpeg'
							className='file-input'
							name='avatar'
						/>
						<label className='label'>Max size 2MB</label>
					</fieldset>

					<div className='card-actions justify-end'>
						<button
							disabled={actionIsPending}
							className='btn btn-primary'
							type='submit'>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

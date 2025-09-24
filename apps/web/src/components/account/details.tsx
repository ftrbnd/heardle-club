'use client';

import { User } from '@/app/api/auth/_user';
import { useToastActionState } from '@/hooks/use-toast-action-state';
import { deleteUserAvatar, updateAccountDetails } from '@/app/actions/db';
import { UserAvatar } from '@/components/account/avatar';

interface AccountDetailsProps {
	user: User;
}

export function AccountDetails({ user }: AccountDetailsProps) {
	const {
		formAction: updateFormAction,
		actionIsPending: updateActionIsPending,
	} = useToastActionState({
		action: updateAccountDetails,
		pendingMessage: 'Updating profile...',
		successMessage: 'Updated profile!',
	});

	const {
		formAction: deleteFormAction,
		actionIsPending: deleteActionIsPending,
	} = useToastActionState({
		action: deleteUserAvatar,
		pendingMessage: 'Deleting avatar...',
		successMessage: 'Deleted avatar',
	});

	return (
		<div className='place-self-center card lg:card-side bg-base-100 shadow-sm md:mx-16'>
			<figure>
				<UserAvatar
					user={user}
					className='rounded-md'
					imageSize={256}
				/>
			</figure>
			<div className='card-body'>
				<h2 className='card-title'>Account Details</h2>
				<form action={updateFormAction}>
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
							disabled={
								deleteActionIsPending || updateActionIsPending || !user.imageURL
							}
							formAction={deleteFormAction}
							className='btn btn-soft btn-error'>
							Delete avatar
						</button>
						<button
							disabled={updateActionIsPending || deleteActionIsPending}
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

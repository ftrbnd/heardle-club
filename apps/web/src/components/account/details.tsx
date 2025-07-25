import { User } from '@/actions/_user';

interface AccountDetailsProps {
	user: User;
}

export function AccountDetails({ user }: AccountDetailsProps) {
	return (
		<div className='card lg:card-side bg-base-100 shadow-sm md:mx-16'>
			<figure>
				<img
					src='https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp'
					alt='Album'
				/>
			</figure>
			<div className='card-body'>
				<h2 className='card-title'>Account Details</h2>
				<fieldset className='fieldset'>
					<legend className='fieldset-legend'>Display name</legend>
					<input
						type='text'
						className='input'
						placeholder='Display name'
						defaultValue={user.displayName ?? undefined}
					/>
				</fieldset>
				<fieldset className='fieldset'>
					<legend className='fieldset-legend'>Avatar</legend>
					<input
						type='file'
						accept='image/png, image/jpeg'
						className='file-input'
					/>
					<label className='label'>Max size 2MB</label>
				</fieldset>

				<div className='card-actions justify-end'>
					<button className='btn btn-primary'>Save</button>
				</div>
			</div>
		</div>
	);
}

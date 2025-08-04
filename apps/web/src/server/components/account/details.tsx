import { User } from '@/server/actions/_user';
import Image from 'next/image';

interface AccountDetailsProps {
	user: User;
}

export function AccountDetails({ user }: AccountDetailsProps) {
	return (
		<div className='place-self-center card lg:card-side bg-base-100 shadow-sm md:mx-16'>
			<figure>
				<Image
					src='https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp'
					className='self-start max-w-96 max-h-96'
					alt='Album'
					height={500}
					width={500}
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

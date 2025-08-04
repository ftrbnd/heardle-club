'use client';

import { Alert } from '@/server/components/icons/alert';
import { Upload } from '@/server/components/icons/upload';
import { useFormStatus } from 'react-dom';

export function AddSongsButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type='submit'
			disabled={pending}
			className='btn btn-primary self-start'>
			{pending ? <Alert type='loading' /> : <Upload />}
			{pending ? ' Submitting...' : 'Add songs'}
		</button>
	);
}

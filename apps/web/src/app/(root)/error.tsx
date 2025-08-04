'use client';

import { useEffect } from 'react';

export default function Error({
	error,
}: {
	error: Error & { digest?: string };
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className='flex-1 flex justify-center items-center'>
			<div
				role='alert'
				className='alert alert-error alert-soft'>
				<span>{error.message}</span>
			</div>
		</div>
	);
}

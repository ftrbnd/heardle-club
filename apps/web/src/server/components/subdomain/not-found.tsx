import { Alert } from '@/server/components/icons/alert';
import { rootURL } from '@/lib/domains';
import Link from 'next/link';

export function ClubNotFound() {
	return (
		<div className='flex-1 flex flex-col items-center justify-center w-full'>
			<div
				role='alert'
				className='alert alert-error px-16'>
				<Alert type='error' />
				<Link
					href={rootURL}
					className='link'>
					This club does not exist.
				</Link>
			</div>
		</div>
	);
}

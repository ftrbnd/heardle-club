import { Alert } from '@/components/icons/alert';
import { rootURL } from '@/util/domains';
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

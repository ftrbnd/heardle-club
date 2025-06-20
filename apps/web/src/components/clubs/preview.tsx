import { protocol, rootDomain } from '@/lib/utils';
import { SelectClub } from '@repo/database/postgres';
import Image from 'next/image';
import Link from 'next/link';

export async function ClubPreview({ club }: { club: SelectClub }) {
	const href = `${protocol}://${club.subdomain}.${rootDomain}`;

	return (
		<Link
			href={href}
			prefetch={false}
			passHref>
			<div className='card bg-base-100 w-96 shadow-sm'>
				<figure>
					<Image
						src='/artist_placeholder.jpg'
						priority
						alt={club.displayName}
						width={200}
						height={100}
					/>
				</figure>
				<div className='card-body'>
					<h2 className='card-title'>
						{club.displayName}
						<div className='badge badge-secondary'>Day {club.heardleDay}</div>
					</h2>
					<div className='card-actions justify-end'>
						<div className='btn btn-outline'>Join</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

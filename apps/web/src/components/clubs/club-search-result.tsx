import { getSubdomainURL } from '@/lib/domains';
import { SelectClub } from '@repo/database/postgres';
import Image from 'next/image';
import Link from 'next/link';

export function ClubSearchResult({ club }: { club: SelectClub }) {
	const href = getSubdomainURL(club.subdomain);

	return (
		<Link
			href={href}
			prefetch={false}
			passHref>
			<div className='carousel-item card bg-base-100 image-full w-full shadow-sm'>
				<figure>
					<Image
						src={club.imageURL ?? '/artist_placeholder.jpg'}
						alt={club.displayName}
						height={50}
						width={50}
						className='w-full max-h-18'
					/>
				</figure>
				<div className='card-body'>
					<p className='font-bold'>{club.displayName}</p>
				</div>
			</div>
		</Link>
	);
}

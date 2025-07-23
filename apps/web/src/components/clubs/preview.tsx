import { getArtist } from '@/actions/spotify';
import { getSubdomainURL } from '@/lib/domains';
import { SelectClub } from '@repo/database/postgres';
import Image from 'next/image';
import Link from 'next/link';

export async function ClubPreview({ club }: { club: SelectClub }) {
	const href = getSubdomainURL(club.subdomain);
	const artist = await getArtist(club.artistId);

	return (
		<Link
			href={href}
			prefetch={false}
			passHref>
			<div className='card bg-base-100 max-w-96 shadow-sm'>
				<figure>
					<Image
						src={
							artist.images.find((img) => img)?.url ?? '/artist_placeholder.jpg'
						}
						priority
						alt={club.displayName}
						width={200}
						height={200}
						className='w-full max-h-48 object-cover'
					/>
				</figure>
				<div className='card-body flex flex-row justify-between'>
					<h2 className='card-title'>{club.displayName}</h2>
					<div className='badge badge-secondary'>Day {club.heardleDay}</div>
				</div>
			</div>
		</Link>
	);
}

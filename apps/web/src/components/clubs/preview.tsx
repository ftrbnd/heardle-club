import { getArtist } from '@/actions/spotify';
import { protocol, rootDomain } from '@/lib/utils';
import { SelectClub } from '@repo/database/postgres';
import Image from 'next/image';
import Link from 'next/link';

export async function ClubPreview({ club }: { club: SelectClub }) {
	const href = `${protocol}://${club.subdomain}.${rootDomain}`;
	const artist = await getArtist(club.artistId);

	return (
		<Link
			href={href}
			prefetch={false}
			passHref>
			<div className='card bg-base-100 w-96 shadow-sm'>
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

import { getArtist } from '@/app/actions/spotify';
import { cn } from '@/util';
import { getSubdomainURL } from '@/util/domains';
import { SelectClub } from '@repo/database/postgres/schema';
import Link from 'next/link';
import { CSSProperties } from 'react';

interface ClubMenuItemProps {
	club: SelectClub;
}

export async function ClubMenuItem({ club }: ClubMenuItemProps) {
	const artist = club?.artistId ? await getArtist(club.artistId) : null;
	const artistImageUrl = artist?.images.find((image) => image.url)?.url;

	const clubSubdomain = getSubdomainURL(club.subdomain);

	return (
		<li
			style={
				{
					'--dynamic-bg-url': artistImageUrl ? `url(${artistImageUrl}` : '',
				} as CSSProperties
			}
			className={cn(
				'rounded-md',
				artistImageUrl
					? `bg-[image:var(--dynamic-bg-url)] bg-cover bg-center`
					: 'bg-base-100'
			)}>
			<Link
				className='backdrop-blur-xs bg-base-100/60 hover:opacity-80'
				href={clubSubdomain}
				prefetch={false}>
				<p>{club.displayName}</p>
				<p className='badge badge-xs badge-soft badge-accent'>
					Day {club.heardleDay}
				</p>
			</Link>
		</li>
	);
}

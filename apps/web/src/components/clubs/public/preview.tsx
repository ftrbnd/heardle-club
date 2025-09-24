import { getCurrentUser } from '@/app/api/auth/server.services';
import { getArtist } from '@/app/api/spotify/server.services';
import { LeaveClubButton } from '@/components/clubs/membership/leave-club-button';
import { getSubdomainURL } from '@/util/domains';
import { SelectClub } from '@repo/database/postgres/schema';
import Image from 'next/image';
import Link from 'next/link';

export async function ClubPreview({
	club,
	display,
}: {
	club: SelectClub;
	display: 'grid' | 'list';
}) {
	const user = await getCurrentUser();
	const clubSubdomain = getSubdomainURL(club.subdomain);
	const artist = await getArtist(club.artistId);
	const artistImage =
		artist.images.find((img) => img)?.url ?? '/artist_placeholder.jpg';

	return display === 'grid' ? (
		<Link
			href={clubSubdomain}
			prefetch={false}
			passHref>
			<div className='card bg-base-100 max-w-96 shadow-sm'>
				<figure>
					<Image
						src={artistImage}
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
	) : (
		<div className='flex gap-4 justify-between items-center bg-base-200 p-4 rounded-md'>
			<div className='flex gap-2'>
				<Image
					src={artistImage}
					priority
					alt={club.displayName}
					width={200}
					height={200}
					className='size-16 rounded-box'
				/>
				<div className='flex-1'>
					<Link
						href={clubSubdomain}
						className='flex-1 link'>
						{club.displayName}
					</Link>
					<div className='text-xs uppercase font-semibold opacity-60'>
						Day {club.heardleDay}
					</div>
				</div>
			</div>
			<LeaveClubButton
				userId={user?.id}
				club={club}
			/>
		</div>
	);
}

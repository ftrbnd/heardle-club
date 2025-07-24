import { getCurrentUser } from '@/actions/auth';
import { getArtist } from '@/actions/spotify';
import { NewClubForm } from '@/components/clubs/new-club-form';
import { User } from '@/actions/_user';
import { getSubdomainURL, loginURL } from '@/lib/domains';
import { getClubByArtistId } from '@repo/database/api';
import { SelectClub } from '@repo/database/postgres';
import { Artist } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const artistId = (await searchParams).artistId;
	if (!artistId || artistId instanceof Array)
		return (
			<div
				role='alert'
				className='flex-1 alert alert-error alert-soft'>
				<span>Invalid artist ID.</span>
			</div>
		);

	const user = await getCurrentUser();
	const artist = await getArtist(artistId);
	const club = await getClubByArtistId(artistId);
	const clubAlreadyExists = club !== null;
	const artistImage =
		artist.images.find((image) => image.url)?.url ?? './artist_placeholder.jpg';

	return (
		<div className='p-8 flex-1 flex flex-col items-center w-full'>
			<div className='card lg:card-side bg-base-100 shadow-sm w-3/4 max-w-[1280px]'>
				<figure>
					<Image
						src={artistImage}
						alt={artist.name}
						height={500}
						width={500}
					/>
				</figure>
				<div className='card-body'>
					<h2 className='card-title'>Create a club for {artist.name}</h2>
					<FormDisabledAlert
						club={club}
						artist={artist}
						user={user}
					/>
					<NewClubForm
						artist={artist}
						clubAlreadyExists={clubAlreadyExists}
					/>
				</div>
			</div>
		</div>
	);
}

interface FormDisabledAlertProps {
	club: SelectClub | null;
	artist: Artist;
	user: User | null;
}

export function FormDisabledAlert({
	club,
	artist,
	user,
}: FormDisabledAlertProps) {
	if (!club && user) return <></>;

	return (
		<div
			role='alert'
			className='alert alert-error alert-soft'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='h-6 w-6 shrink-0 stroke-current'
				fill='none'
				viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
				/>
			</svg>
			{club ? (
				<Link
					href={getSubdomainURL(club.subdomain)}
					className='link'>
					A club for {artist.name} already exists!
				</Link>
			) : !user ? (
				<p>
					<Link
						href={loginURL}
						className='link'>
						Log in
					</Link>{' '}
					to create a club.
				</p>
			) : (
				<></>
			)}
		</div>
	);
}

import { getCurrentUser } from '@/app/api/auth/server.services';
import { getArtist } from '@/app/api/spotify/server.services';
import { NewClubForm } from '@/components/clubs/membership/new-club-form';
import { User } from '@/app/api/auth/_user';
import { getSubdomainURL, loginURL } from '@/util/domains';
import { getClubByArtistId } from '@repo/database/postgres/api';
import { SelectClub } from '@repo/database/postgres/schema';
import { Artist } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import Link from 'next/link';
import { Alert } from '@/components/icons/alert';

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
			<Alert type='warning' />
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

import { getArtist } from '@/actions/spotify';
import { protocol, rootDomain } from '@/lib/utils';
import { getClubByArtistId } from '@repo/database/api';
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

	const artist = await getArtist(artistId);
	const club = await getClubByArtistId(artistId);
	const clubAlreadyExists = club !== null;

	return (
		<div className='p-8 flex-1 flex flex-col items-center w-full'>
			<div className='card lg:card-side bg-base-100 shadow-sm w-3/4 max-w-[1280px]'>
				<figure>
					<Image
						src={
							artist.images.find((image) => image.url)?.url ??
							'./artist_placeholder.jpg'
						}
						alt={artist.name}
						height={500}
						width={500}
					/>
				</figure>
				<div className='card-body'>
					<h2 className='card-title'>Create a club for {artist.name}</h2>
					{clubAlreadyExists && (
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
							<Link
								href={`${protocol}://${club.subdomain}.${rootDomain}`}
								className='link'>
								A club for {artist.name} already exists!
							</Link>
						</div>
					)}
					<form className='w-full'>
						<fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 '>
							<legend className='fieldset-legend'>Club details</legend>

							<label className='label'>Subdomain</label>
							<input
								disabled={clubAlreadyExists}
								type='text'
								className='input w-full'
								placeholder='[subdomain].heardle.club'
							/>

							<label className='label'>Display name</label>
							<input
								disabled={clubAlreadyExists}
								type='text'
								className='input w-full'
								placeholder={artist.name}
							/>

							<label className='label'>Image (Max size 2MB)</label>
							<input
								disabled={clubAlreadyExists}
								type='file'
								className='file-input'
							/>
						</fieldset>
					</form>
					<div className='card-actions justify-end'>
						<button
							disabled={clubAlreadyExists}
							className='btn btn-primary'>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

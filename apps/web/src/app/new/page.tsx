import { getArtist } from '@/actions/spotify';
import Image from 'next/image';

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
					<form className='w-full'>
						<fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 '>
							<legend className='fieldset-legend'>Club details</legend>

							<label className='label'>Subdomain</label>
							<input
								type='text'
								className='input w-full'
								placeholder='[subdomain].heardle.club'
							/>

							<label className='label'>Display name</label>
							<input
								type='text'
								className='input w-full'
								placeholder={artist.name}
							/>

							<label className='label'>Image (Max size 2MB)</label>
							<input
								type='file'
								className='file-input'
							/>
						</fieldset>
					</form>
					<div className='card-actions justify-end'>
						<button className='btn btn-primary'>Submit</button>
					</div>
				</div>
			</div>
		</div>
	);
}

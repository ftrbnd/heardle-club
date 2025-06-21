'use client';

import { searchArtist } from '@/actions/spotify';
import { Artist } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { FormEvent, useDeferredValue, useState } from 'react';

const MODAL_ID = 'create_club_modal';

export function CreateClub() {
	const [query, setQuery] = useState('');
	const deferredQuery = useDeferredValue(query);
	const [results, setResults] = useState<Artist[]>([]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const artists = await searchArtist(deferredQuery);
		setResults(artists);
	};

	const openModal = () => {
		const modal = document.getElementById(MODAL_ID) as HTMLDialogElement;
		if (!modal) return;

		modal.showModal();
	};

	return (
		<div>
			<button
				className='btn btn-primary'
				onClick={openModal}>
				Create your own
			</button>
			<dialog
				id={MODAL_ID}
				className='modal'>
				<div className='modal-box flex flex-col gap-2'>
					<h3 className='font-bold text-lg'>Create a club</h3>
					<form onSubmit={(e) => handleSubmit(e)}>
						<input
							type='text'
							placeholder='Enter an artist or band'
							className='input input-bordered w-full'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</form>
					<div className='carousel carousel-vertical rounded-box h-96 flex flex-col gap-2'>
						{results.map((artist) => (
							<div
								key={artist.id}
								className='carousel-item card bg-base-100 image-full w-full shadow-sm'>
								<figure>
									<Image
										src={
											artist.images.find((img) => img)?.url ??
											'/artist_placeholder.jpg'
										}
										alt={artist.name}
										height={50}
										width={50}
										className='w-full max-h-18'
									/>
								</figure>
								<div className='card-body'>
									<p className='font-bold'>{artist.name}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<form
					method='dialog'
					className='modal-backdrop'>
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}

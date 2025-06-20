'use client';

import { searchArtist } from '@/actions/spotify';
import { Artist } from '@spotify/web-api-ts-sdk';
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
							className='input input-bordered w-24 md:w-full'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</form>
					{results.map((artist) => (
						<p key={artist.id}>{artist.name}</p>
					))}
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

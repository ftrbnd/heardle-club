'use client';

import { searchArtist } from '@/actions/spotify';
import { SearchModal } from '@/components/search-modal';
import { useSearch } from '@/hooks/use-search';
import Image from 'next/image';

const MODAL_ID = 'create_club_modal';

export function CreateClub() {
	const { query, setQuery, results, handleSubmit, openModal } = useSearch({
		modalId: MODAL_ID,
		searchFn: searchArtist,
	});

	return (
		<SearchModal
			modalId={MODAL_ID}
			query={query}
			setQuery={setQuery}
			buttonLabel='Create your own'
			modalLabel='Create a club'
			placeholder='Enter an artist or band'
			openModal={openModal}
			handleSubmit={handleSubmit}>
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
		</SearchModal>
	);
}

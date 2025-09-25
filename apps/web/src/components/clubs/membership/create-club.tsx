'use client';

import { searchArtist } from '@/app/actions/spotify';
import { SearchModal } from '@/components/layout/search-modal';
import { useSearch } from '@/hooks/use-search';
import Image from 'next/image';
import Link from 'next/link';

const MODAL_ID = 'create_club_modal';

export function CreateClub() {
	const {
		query,
		setQuery,
		results: artists,
		handleSubmit,
		openModal,
		closeModal,
	} = useSearch({
		modalId: MODAL_ID,
		searchFn: searchArtist,
	});

	return (
		<SearchModal
			modalId={MODAL_ID}
			query={query}
			setQuery={setQuery}
			buttonLabel='Create your own'
			buttonClassName='btn-primary'
			modalLabel='Create a club'
			placeholder='Enter an artist or band'
			openModal={openModal}
			handleSubmit={handleSubmit}>
			{artists.map((artist) => (
				<Link
					onClick={closeModal}
					key={artist.id}
					href={`/new?artistId=${artist.id}`}
					prefetch={false}
					passHref>
					<div className='hover:cursor-pointer hover:opacity-80 carousel-item card bg-base-100 image-full w-full shadow-sm'>
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
				</Link>
			))}
		</SearchModal>
	);
}

'use client';

import { ClubSearchResult } from '@/components/clubs/public/club-search-result';
import { CreateClub } from '@/components/clubs/membership/create-club';
import { SearchModal } from '@/components/layout/search-modal';
import { useSearch } from '@/hooks/use-search';
import { searchClubs } from '@/app/api/clubs.service';

const MODAL_ID = 'find_club_modal';

export function FindClub() {
	const {
		query,
		setQuery,
		dirty,
		results: clubs,
		handleSubmit,
		openModal,
	} = useSearch({
		modalId: MODAL_ID,
		searchFn: searchClubs,
	});

	return (
		<SearchModal
			modalId={MODAL_ID}
			query={query}
			setQuery={setQuery}
			buttonLabel='Find a club'
			buttonClassName='btn-secondary'
			modalLabel='Search for a club'
			placeholder='Enter an artist or band'
			openModal={openModal}
			handleSubmit={handleSubmit}>
			{dirty && clubs.length === 0 && (
				<div className='flex flex-col items-center'>
					<p className='text-center p-4'>No clubs found.</p>
					<CreateClub />
				</div>
			)}
			{clubs.map((club) => (
				<ClubSearchResult
					key={club.id}
					club={club}
				/>
			))}
		</SearchModal>
	);
}

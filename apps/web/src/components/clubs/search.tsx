'use client';

import { useState } from 'react';

export function SearchClub() {
	const [query, setQuery] = useState('');

	// TODO: implement searchClubs()
	return (
		<input
			type='text'
			placeholder='Find a club'
			className='input input-bordered w-24 md:w-auto'
			value={query}
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
}

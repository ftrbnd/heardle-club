'use client';

import { searchArtist } from '@/lib/spotify/actions';
import { Artist } from '@spotify/web-api-ts-sdk';
import { FormEvent, useDeferredValue, useState } from 'react';

export function CreateClub() {
	const [showForm, setShowForm] = useState(false);
	const [query, setQuery] = useState('');
	const deferredQuery = useDeferredValue(query);
	const [results, setResults] = useState<Artist[]>([]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const artists = await searchArtist(deferredQuery);
		setResults(artists);
	};

	const toggleForm = () => {
		setShowForm((prev) => !prev);
		setQuery('');
		setResults([]);
	};

	return (
		<div>
			<button onClick={toggleForm}>Create your own!</button>
			{showForm && (
				<form onSubmit={(e) => handleSubmit(e)}>
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</form>
			)}
			{results.map((artist) => (
				<p key={artist.id}>{artist.name}</p>
			))}
		</div>
	);
}

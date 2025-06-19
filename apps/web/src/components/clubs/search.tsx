'use client';

import { useState } from 'react';

export function SearchClub() {
	const [query, setQuery] = useState('');

	return (
		<div>
			<label>
				Search clubs:
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</label>
		</div>
	);
}

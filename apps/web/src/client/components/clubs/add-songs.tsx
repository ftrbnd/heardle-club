'use client';

import { Search } from '@/server/components/icons/search';
import { SelectClub } from '@repo/database/postgres';

export function AddSongs({ club }: { club: SelectClub }) {
	return (
		<div className=''>
			<label className='input'>
				<Search />
				<input
					type='search'
					required
					placeholder='Search'
				/>
			</label>
			<button className='btn btn-primary'>Add songs</button>
		</div>
	);
}

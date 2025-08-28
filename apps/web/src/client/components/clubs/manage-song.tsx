'use client';

import { FileUp } from '@/server/components/icons/file-up';
import { Trash } from '@/server/components/icons/trash';
import { SelectBaseSong } from '@repo/database/postgres';

interface ManageSongProps {
	song: SelectBaseSong;
}

export function ManageSong({}: ManageSongProps) {
	return (
		<div className='join'>
			<button className='btn btn-secondary join-item'>
				<FileUp />
				Replace
			</button>
			<button className='btn btn-error join-item'>
				<Trash />
				Delete
			</button>
		</div>
	);
}

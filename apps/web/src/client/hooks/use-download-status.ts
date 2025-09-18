import { serverURL } from '@/lib/domains';
import { SelectClub } from '@repo/database/postgres/schema';
import { DownloadStatus } from '@repo/database/redis/schema';
import { useEffect, useState } from 'react';

export function useDownloadStatus(club: SelectClub) {
	const [status, setStatus] = useState<NonNullable<DownloadStatus>>({
		current: 0,
		total: 0,
	});

	useEffect(() => {
		const evtSource = new EventSource(`${serverURL}/clubs/${club.id}/status`, {
			withCredentials: true,
		});

		evtSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data) setStatus(data);
		};

		return () => evtSource.close();
	}, [club.id]);

	return { status };
}

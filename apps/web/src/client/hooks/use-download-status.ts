import { serverURL } from '@/lib/domains';
import { DownloadStatus } from '@repo/database/api';
import { useEffect, useState } from 'react';

export function useDownloadStatus(clubId: string) {
	const [status, setStatus] = useState<DownloadStatus>({
		current: 0,
		total: 0,
	});

	useEffect(() => {
		const evtSource = new EventSource(`${serverURL}/clubs/${clubId}/status`, {
			withCredentials: true,
		});

		evtSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
			setStatus(data);
		};

		return () => evtSource.close();
	}, [clubId]);

	return { status };
}

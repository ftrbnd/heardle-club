import { serverURL } from '@/lib/domains';
import { SelectClub } from '@repo/database/postgres/schema';
import { useEffect, useState } from 'react';

export function useDownloadStatus(club: SelectClub) {
	// TODO: share types with @server/workers
	const [status, setStatus] = useState({
		currentTrack: null,
		currentStep: 0,
		totalTracks: 0,
		percentage: 0,
	});

	useEffect(() => {
		const evtSource = new EventSource(`${serverURL}/clubs/${club.id}/status`, {
			withCredentials: true,
		});

		evtSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
			if (data) setStatus(data);
		};

		return () => evtSource.close();
	}, [club.id]);

	return { status };
}

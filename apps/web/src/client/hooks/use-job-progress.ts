import { serverURL } from '@/lib/domains';
import { SelectClub } from '@repo/database/postgres/schema';
import {
	DailyJobProgress,
	dailyJobProgressSchema,
	DownloadJobProgress,
	downloadJobProgressSchema,
} from '@repo/database/redis/schema';
import { useEffect, useState } from 'react';

type JobProgressType<T extends 'download' | 'daily'> = T extends 'download'
	? DownloadJobProgress
	: DailyJobProgress;

export function useJobProgress<T extends 'download' | 'daily'>(
	club: SelectClub,
	jobType: T
): { status: JobProgressType<T> } {
	const [status, setStatus] = useState<JobProgressType<T>>(
		(jobType === 'download'
			? {
					currentTrack: null,
					currentStep: 0,
					totalTracks: 0,
					percentage: 0,
				}
			: {
					message: '',
					percentage: 0,
				}) as JobProgressType<T>
	);

	useEffect(() => {
		const evtSource = new EventSource(
			`${serverURL}/clubs/${club.id}/jobs/${jobType}`,
			{
				withCredentials: true,
			}
		);

		evtSource.onmessage = (event) => {
			const data = JSON.parse(event.data === '{}' ? null : event.data);
			const progress = downloadJobProgressSchema
				.or(dailyJobProgressSchema)
				.nullable()
				.parse(data);

			console.log({ jobType, progress });
			if (progress) setStatus(progress as JobProgressType<T>);
		};

		return () => evtSource.close();
	}, [club.id, jobType]);

	return { status };
}

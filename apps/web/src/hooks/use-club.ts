'use client';

import {
	getClubBySubdomain,
	getClubDailySong,
	getClubSongs,
} from '@/app/api/clubs.service';
import { protocol, rootDomain, rootURL } from '@/util/domains';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function useClub() {
	const [subdomain, setSubdomain] = useState<string | null>(null);

	const { data: club } = useQuery({
		queryKey: ['clubs', subdomain],
		queryFn: () => getClubBySubdomain(subdomain),
		enabled: subdomain !== null,
	});

	const { data: songs } = useQuery({
		queryKey: ['clubs', subdomain, 'songs'],
		queryFn: () => getClubSongs(club?.id),
		enabled: club?.id !== undefined,
		staleTime: 0,
	});

	const { data: daily } = useQuery({
		queryKey: ['clubs', subdomain, 'daily'],
		queryFn: () => getClubDailySong(club?.id),
		enabled: club?.id !== undefined,
		staleTime: 0,
	});

	useEffect(() => {
		const href = window.location.href;

		if (href === rootURL) setSubdomain(null);
		else {
			const subdomain = href
				.split(rootDomain)[0]
				.split(protocol)[1]
				.replace('://', '')
				.replace('.', '');
			setSubdomain(subdomain);
		}
	}, []);

	return {
		subdomain,
		club,
		songs,
		daily,
	};
}

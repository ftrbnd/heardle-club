'use client';

import {
	clientGetClubBySubdomain,
	clientGetClubDailySong,
	clientGetClubSongs,
} from '@/app/api/clubs/services';
import { protocol, rootDomain, rootURL } from '@/util/domains';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function useSubdomain() {
	const [subdomain, setSubdomain] = useState<string>('');

	const { data: club } = useQuery({
		queryKey: ['subdomain', 'club', subdomain],
		queryFn: () => clientGetClubBySubdomain(subdomain),
		enabled: subdomain !== '',
	});

	const { data: songs } = useQuery({
		queryKey: ['subdomain', 'club', 'songs', subdomain],
		queryFn: () => clientGetClubSongs(club?.id),
		staleTime: 0,
	});

	const { data: daily } = useQuery({
		queryKey: ['subdomain', 'club', 'daily', subdomain],
		queryFn: () => clientGetClubDailySong(club?.id),
		staleTime: 0,
	});

	useEffect(() => {
		const href = window.location.href;

		if (href === rootURL) setSubdomain('');
		else {
			const subdomain = href
				.split(rootDomain)[0]
				.split(protocol)[1]
				.replace('://', '')
				.replace('.', '');
			setSubdomain(subdomain);
		}
	}, []);

	return { subdomain, club, songs, daily };
}

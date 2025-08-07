'use client';

import { protocol, rootDomain, rootURL } from '@/lib/domains';
import { findClubBySubdomain, findClubSongs } from '@/server/actions/db';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function useSubdomain() {
	const [subdomain, setSubdomain] = useState<string>('');

	const { data: club } = useQuery({
		queryKey: ['subdomain', 'club', subdomain],
		queryFn: () => findClubBySubdomain(subdomain),
	});

	const { data: songs } = useQuery({
		queryKey: ['subdomain', 'club', 'songs', subdomain],
		queryFn: () => findClubSongs(club?.id),
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

	return { subdomain, club, songs };
}

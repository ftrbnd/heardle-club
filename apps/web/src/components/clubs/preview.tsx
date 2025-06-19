import { protocol, rootDomain } from '@/lib/utils';
import { SelectClub } from '@repo/database/postgres';
import Link from 'next/link';

export function ClubPreview({ club }: { club: SelectClub }) {
	const href = `${protocol}://${club.subdomain}.${rootDomain}`;

	return (
		<Link
			href={href}
			prefetch={false}
			passHref>
			<div>
				<h4>{club.displayName}</h4>
				<p>Day {club.heardleDay}</p>
			</div>
		</Link>
	);
}

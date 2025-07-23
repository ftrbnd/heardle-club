'use client';

import { CreateClub } from '@/components/clubs/create-club';
import { FindClub } from '@/components/clubs/find-club';
import { CLIENT_URL } from '@/lib/domains';
import { SelectClub } from '@repo/database/postgres';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarItemsProps {
	club?: SelectClub | null;
}

export function NavbarItems({ club }: NavbarItemsProps) {
	const pathname = usePathname();

	if (club)
		return (
			<Link href={CLIENT_URL}>
				<h2 className='btn btn-ghost text-lg'>Heardle Club</h2>
			</Link>
		);

	if (pathname !== '/new')
		return (
			<>
				<FindClub />
				<CreateClub />
			</>
		);

	return <></>;
}

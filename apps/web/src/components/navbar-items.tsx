'use client';

import { CreateClub } from '@/components/clubs/create-club';
import { FindClub } from '@/components/clubs/find-club';
import { protocol, rootDomain } from '@/lib/utils';
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
			<Link href={`${protocol}://${rootDomain}`}>
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

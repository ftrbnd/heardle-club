'use client';

import { CreateClub } from '@/client/components/clubs/create-club';
import { FindClub } from '@/client/components/clubs/find-club';
import { rootURL } from '@/lib/domains';
import { SelectClub } from '@repo/database/postgres/schema';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarItemsProps {
	club?: SelectClub | null;
}

export function NavbarItems({ club }: NavbarItemsProps) {
	const pathname = usePathname();

	if (club)
		return (
			<Link href={rootURL}>
				<h2 className='btn btn-ghost px-0 md:px-4 text-sm md:text-lg'>
					Heardle Club
				</h2>
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

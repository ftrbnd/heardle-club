'use client';

import { CreateClub } from '@/components/clubs/membership/create-club';
import { FindClub } from '@/components/clubs/public/find-club';
import { rootURL } from '@/util/domains';
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

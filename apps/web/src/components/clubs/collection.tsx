import { getCurrentUser } from '@/actions/auth';
import { FindClub } from '@/components/clubs/find-club';
import { ClubPreview } from '@/components/clubs/preview';
import { SelectClub } from '@repo/database/postgres';
import Link from 'next/link';

interface ClubsCollectionParams {
	title: 'Trending' | 'Your Clubs';
	clubs: SelectClub[];
}

export async function ClubsCollection({ title, clubs }: ClubsCollectionParams) {
	const user = await getCurrentUser();

	return (
		<section className='flex flex-col gap-2 items-center'>
			<h3 className='text-3xl'>{title}</h3>
			{title === 'Your Clubs' && !user ? (
				<div className='card bg-base-100 w-96 shadow-sm self-center'>
					<div className='card-body'>
						<h2 className='card-title'>
							Create an account to save your favorite clubs.
						</h2>
						<div className='card-actions justify-end'>
							<Link
								href='/login'
								className='btn btn-primary'>
								Log in
							</Link>
						</div>
					</div>
				</div>
			) : clubs.length === 0 ? (
				<div className='card bg-base-100 w-96 shadow-sm self-center'>
					<div className='card-body'>
						<h2 className='card-title'>You haven&apos;t joined a club yet.</h2>
						<div className='card-actions justify-end'>
							<FindClub />
						</div>
					</div>
				</div>
			) : (
				<ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{clubs.map((club) => (
						<li key={club.id}>
							<ClubPreview club={club} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

import { getCurrentUser } from '@/app/actions/auth';
import { FindClub } from '@/components/clubs/public/find-club';
import { ClubPreview } from '@/components/clubs/public/preview';
import { loginURL } from '@/util/domains';
import { SelectClub } from '@repo/database/postgres/schema';
import Link from 'next/link';

interface ClubsCollectionParams {
	title: 'Trending' | 'Your Clubs';
	clubs: SelectClub[];
	display?: 'grid' | 'list';
}

export async function ClubsCollection({
	title,
	clubs,
	display = 'grid',
}: ClubsCollectionParams) {
	const user = await getCurrentUser();

	return (
		<section className='flex flex-col gap-2 items-center'>
			<h3 className='text-3xl font-bold self-start'>{title}</h3>
			{title === 'Your Clubs' && !user ? (
				<div className='card bg-base-100 w-96 shadow-sm self-center'>
					<div className='card-body'>
						<h2 className='card-title'>
							Create an account to save your favorite clubs.
						</h2>
						<div className='card-actions justify-end'>
							<Link
								href={loginURL}
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
				<ul
					className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 ${display === 'list' ? 'w-full md:px-16' : ''}`}>
					{clubs.map((club) => (
						<li key={club.id}>
							<ClubPreview
								club={club}
								display={display}
							/>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

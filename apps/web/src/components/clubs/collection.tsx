import { ClubPreview } from '@/components/clubs/preview';
import { SelectClub, SelectSession } from '@repo/database/postgres';

interface ClubsCollectionParams {
	title: 'Trending' | 'Your Clubs';
	clubs: SelectClub[];
	session: SelectSession | null;
}

export function ClubsCollection({
	title,
	clubs,
	session,
}: ClubsCollectionParams) {
	return (
		<section className='flex flex-col gap-2 w-full'>
			<h3 className='text-3xl'>{title}</h3>
			{title === 'Your Clubs' && !session ? (
				<div className='card bg-base-100 w-96 shadow-sm self-center'>
					<div className='card-body'>
						<p>Create an account to save your favorite clubs.</p>
						<div className='card-actions justify-end'>
							<button className='btn btn-primary'>Sign in</button>
						</div>
					</div>
				</div>
			) : clubs.length === 0 ? (
				<div className='card bg-base-100 w-96 shadow-sm self-center'>
					<div className='card-body'>
						<h2 className='card-title'>You haven&apos;t joined a club yet.</h2>
						<p>
							A card component has a figure, a body part, and inside body there
							are title and actions parts
						</p>
						<div className='card-actions justify-end'>
							<button className='btn btn-primary'>Find a club</button>
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

import { ClubPreview } from '@/components/clubs/preview';
import { SelectClub } from '@repo/database/postgres';

interface ClubsCollectionParams {
	title: string;
	clubs: SelectClub[];
}

export function ClubsCollection({ title, clubs }: ClubsCollectionParams) {
	return (
		<section>
			<h3>{title}</h3>
			<ul>
				{clubs.map((club) => (
					<li key={club.id}>
						<ClubPreview club={club} />
					</li>
				))}
			</ul>
		</section>
	);
}

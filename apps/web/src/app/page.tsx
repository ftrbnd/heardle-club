import { ClubPreview } from '@/components/clubs/preview';
import { getClubs } from '@repo/database/api';

export default async function HomePage() {
	const clubs = await getClubs();

	return (
		<div>
			<section>
				<h3>Trending</h3>
				<ul>
					{clubs.map((club) => (
						<li key={club.id}>
							<ClubPreview club={club} />
						</li>
					))}
				</ul>
			</section>
			<section>
				<h3>Your clubs</h3>
				<ul>
					{clubs.map((club) => (
						<li key={club.id}>
							<ClubPreview club={club} />
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

import { AddSongs } from '@/client/components/clubs/add-songs';
import { ClubSongs } from '@/server/components/clubs/club-songs';
import { getClubSongs } from '@repo/database/api';
import { SelectClub } from '@repo/database/postgres';

interface DashboardProps {
	club: SelectClub;
}

export async function Dashboard({ club }: DashboardProps) {
	const songs = await getClubSongs(club.id);

	return (
		<div>
			<p className='p-4 pb-2  tracking-wide'>
				Songs <span className='badge'>{songs.length}</span>
			</p>
			{songs.length > 0 ? (
				<ClubSongs songs={songs} />
			) : (
				<div
					role='alert'
					className='alert alert-warning alert-soft'>
					<span>Add some songs to get started!</span>
				</div>
			)}
			<AddSongs club={club} />
		</div>
	);
}

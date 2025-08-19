import { AddSongs } from '@/client/components/clubs/add-songs';
import { ManageClub } from '@/client/components/clubs/manage-club';
import { ClubSongs } from '@/server/components/clubs/club-songs';
import { getClubSongs } from '@repo/database/api';
import { SelectClub } from '@repo/database/postgres';

interface DashboardProps {
	club: SelectClub;
}

export async function Dashboard({ club }: DashboardProps) {
	const songs = await getClubSongs(club.id);

	return (
		<div className='tabs tabs-border'>
			<input
				type='radio'
				name='club_dashboard'
				className='tab'
				aria-label='Club songs'
				defaultChecked
			/>
			<div className='tab-content border-base-300 bg-base-100 md:p-10'>
				{songs.length > 0 ? (
					<ClubSongs songs={songs} />
				) : (
					<div
						role='alert'
						className='alert alert-warning alert-soft'>
						<span>Add some songs to get started!</span>
					</div>
				)}
			</div>

			<input
				type='radio'
				name='club_dashboard'
				className='tab'
				aria-label='Add songs'
			/>
			<div className='tab-content border-base-300 bg-base-100 md:p-10'>
				<AddSongs club={club} />
			</div>

			<input
				type='radio'
				name='club_dashboard'
				className='tab'
				aria-label='Manage'
			/>
			<div className='tab-content border-base-300 bg-base-100 p-2 md:p-10'>
				<ManageClub club={club} />
			</div>
		</div>
	);
}

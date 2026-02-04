import { UserAvatar } from '@/components/account/avatar';
import {
	computeAccuracyPercentage,
	computeMissedGuesses,
	computeStreakStartDate,
	computeWinPercentage,
} from '@/util/game';
import { getClubStatistics } from '@repo/database/postgres/api';
import { SelectClub } from '@repo/database/postgres/schema';

interface LeaderboardProps {
	club: SelectClub;
}

export async function Leaderboard({ club }: LeaderboardProps) {
	const statistics = await getClubStatistics(club.id);

	return (
		<div className='overflow-x-auto'>
			<table className='table table-zebra'>
				{/* head */}
				<thead>
					<tr>
						<th>User</th>
						<th>Current Streak</th>
						<th>Max Streak</th>
						<th>Accuracy</th>
						<th>Games Played</th>
						<th>Win Percentage</th>
					</tr>
				</thead>
				<tbody>
					{statistics.map((stat) => (
						<tr
							key={stat.id}
							className='hover:bg-base-300'>
							<td>
								<div className='flex items-center gap-3'>
									<div className='avatar'>
										<div className='mask mask-squircle h-12 w-12'>
											<UserAvatar
												user={stat.user}
												imageSize={4}
											/>
										</div>
									</div>
									<div>
										<div className='font-bold'>{stat.user?.displayName}</div>
									</div>
								</div>
							</td>
							<td>
								{stat.currentStreak}
								<br />
								<span className='badge badge-ghost badge-sm'>
									Since {computeStreakStartDate(stat.currentStreak)}
								</span>
							</td>
							<td>{stat.maxStreak}</td>
							<td>
								{computeAccuracyPercentage(stat.accuracy, stat.gamesPlayed)}%
								<br />
								<span className='badge badge-ghost badge-sm'>
									{computeMissedGuesses(stat.gamesPlayed, stat.accuracy)}{' '}
									incorrect guesses
								</span>
							</td>
							<td>{stat.gamesPlayed}</td>
							<td>
								{computeWinPercentage(stat.gamesPlayed, stat.gamesWon)}%
								<br />
								<span className='badge badge-ghost badge-sm'>
									{stat.gamesWon} games won
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

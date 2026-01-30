'use client';

import { useUser } from '@/hooks/use-user';
import {
	computeAccuracyPercentage,
	DEFAULT_STATISTICS,
	GUESS_LIMIT,
} from '@/util/game';

export function StatsGrid() {
	const { statistics } = useUser();

	const stats = statistics ?? DEFAULT_STATISTICS;

	const winPct =
		stats.gamesPlayed === 0
			? 0
			: Math.floor((stats.gamesWon / stats.gamesPlayed) * 100);

	const streakStart = new Date();
	streakStart.setDate(streakStart.getDate() - stats.currentStreak);

	const streakDiff = stats.maxStreak - stats.currentStreak;
	const incorrectGuesses = stats.gamesPlayed * GUESS_LIMIT - stats.accuracy;

	return (
		<div className='stats grid-cols-2 grid-flow-row w-full lg:stats-horizontal xl:w-auto shadow'>
			<div className='stat'>
				<div className='stat-title'>Games Played</div>
				<div className='stat-value'>{stats.gamesPlayed}</div>
			</div>

			<div className='stat'>
				<div className='stat-title'>Win Percentage</div>
				<div className='stat-value'>{winPct}%</div>
				<div className='stat-desc'>{stats.gamesWon} games won</div>
			</div>

			<div className='stat'>
				<div className='stat-title'>Accuracy</div>
				<div className='stat-value'>
					{computeAccuracyPercentage(stats.accuracy, stats.gamesPlayed)}%
				</div>
				<div className='stat-desc'>{incorrectGuesses} incorrect guesses</div>
			</div>

			<div className='stat'>
				<div className='stat-title'>Current Streak</div>
				<div className='stat-value'>{stats.currentStreak}</div>
				<div className='stat-desc'>
					Since{' '}
					{streakStart.toLocaleDateString(undefined, {
						month: 'long',
						day: 'numeric',
						// Only show year if it's a past year
						year:
							new Date().getFullYear() !== streakStart.getFullYear()
								? 'numeric'
								: undefined,
					})}
				</div>
			</div>

			<div className='stat'>
				<div className='stat-title'>Max Streak</div>
				<div className='stat-value'>{stats.maxStreak}</div>
				{streakDiff > 0 && (
					<div className='stat-desc'>{streakDiff} days to go!</div>
				)}
			</div>
		</div>
	);
}

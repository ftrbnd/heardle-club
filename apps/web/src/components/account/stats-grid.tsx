'use client';

import { useUser } from '@/hooks/use-user';
import {
	computeAccuracyPercentage,
	computeMissedGuesses,
	computeStreakStartDate,
	computeWinPercentage,
	DEFAULT_STATISTICS,
} from '@/util/game';

export function StatsGrid() {
	const { statistics } = useUser();
	const stats = statistics ?? DEFAULT_STATISTICS;

	const winPct = computeWinPercentage(stats.gamesPlayed, stats.gamesWon);
	const streakDiff = stats.maxStreak - stats.currentStreak;
	const incorrectGuesses = computeMissedGuesses(
		stats.gamesPlayed,
		stats.accuracy
	);

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
					Since {computeStreakStartDate(stats.currentStreak)}
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

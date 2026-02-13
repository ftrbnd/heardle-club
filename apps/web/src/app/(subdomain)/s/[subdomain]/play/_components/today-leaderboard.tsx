'use client';
import { UserAvatar } from '@/components/account/avatar';
import { useClub } from '@/hooks/use-club';

export function TodayLeaderboard() {
	const { guesses } = useClub();

	return (
		<ul className='menu bg-base-200 min-h-full w-80 p-4'>
			<p className='font-bold text-2xl'>Today</p>
			{guesses && guesses.length > 0 ? (
				guesses.map((g) => (
					<li key={g.user.id}>
						<div className='flex items-center'>
							<UserAvatar
								user={g.user}
								imageSize={100}
								className='w-6 rounded-full'
							/>
							<p className='max-w-24 text-start truncate'>
								{g.user.displayName}
							</p>
							<p className='flex-1 text-end'>{g.squares}</p>
						</div>
					</li>
				))
			) : (
				<li>
					<a>{"No one has completed today's Heardle yet."}</a>
				</li>
			)}
		</ul>
	);
}

import { SelectClub } from '@repo/database/postgres/schema';

interface LeaderboardProps {
	club: SelectClub;
}

export function Leaderboard({ club }: LeaderboardProps) {
	return <div>{club.displayName}</div>;
}

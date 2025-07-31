import { SelectClub } from '@repo/database/postgres';

interface DashboardProps {
	club: SelectClub;
}

export async function Dashboard({ club }: DashboardProps) {
	return <div>{club.displayName} Dashboard</div>;
}

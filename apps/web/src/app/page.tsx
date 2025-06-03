import { db } from '@repo/database';
import { clubsTable, usersTable } from '@repo/database/schema';

export default async function Home() {
	const allUsers = await db.select().from(usersTable);
	const allClubs = await db.select().from(clubsTable);

	return (
		<div>
			<h1>Hello</h1>
			<ul>
				<h2>Users</h2>
				{allUsers.length > 0 ? (
					allUsers.map((user) => <li key={user.id}>{JSON.stringify(user)}</li>)
				) : (
					<p>No users found.</p>
				)}
			</ul>
			<ul>
				<h2>Clubs</h2>
				{allClubs.length > 0 ? (
					allClubs.map((club) => <li key={club.id}>{JSON.stringify(club)}</li>)
				) : (
					<p>No clubs found.</p>
				)}
			</ul>
		</div>
	);
}

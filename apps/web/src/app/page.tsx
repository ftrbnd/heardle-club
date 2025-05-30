import { db } from '@repo/database';
import { usersTable } from '@repo/database/schema';

export default async function Home() {
	const allUsers = await db.select().from(usersTable);
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
		</div>
	);
}

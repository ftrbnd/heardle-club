import { CreateClub } from '@/components/clubs/create-club';
import { SearchClub } from '@/components/clubs/search';

export function Navbar() {
	return (
		<nav>
			<h2>Heardle Club</h2>
			<ul>
				<li>About</li>
				<li>Rules</li>
				<li>
					<CreateClub />
				</li>
				<li>
					<SearchClub />
				</li>
				<li>Account</li>
			</ul>
		</nav>
	);
}

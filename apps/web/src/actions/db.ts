'use server';

import { searchClubs } from '@repo/database/api';

export async function searchForClubs(query: string) {
	const res = await searchClubs(query);
	return res;
}

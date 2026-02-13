import { completedHeardle, getShareableSquares } from '@/util/game';
import { getUserById } from '@repo/database/postgres/api';
import { SelectUser } from '@repo/database/postgres/schema';
import { getClubGuesses, getUserGuesses } from '@repo/database/redis/api';
import { NextRequest, NextResponse } from 'next/server';

export type ClubGuessesResult = Array<{
	user: SelectUser;
	squares: string;
}>;

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

	const guessKeys = await getClubGuesses(id);
	const userSquares = guessKeys.map(async (key) => {
		const userId = key.split(':')[1];

		const user = await getUserById(userId);
		if (!user) return null;

		const userGuesses = await getUserGuesses({ clubId: id, userId });
		if (!completedHeardle(userGuesses)) return null; // only display completed Heardles on the Today sidebar

		const squares = getShareableSquares(userGuesses);

		return { user, squares };
	});

	const result = (await Promise.all(userSquares)).filter((res) => res !== null);

	return NextResponse.json(result);
}

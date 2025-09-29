import { GUESS_LIMIT } from '@/util/game';
import { addUserGuess, getUserGuesses } from '@repo/database/redis/api';
import { guessSchema } from '@repo/database/redis/schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

interface RouteParams {
	id: string;
	clubId: string;
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<RouteParams> }
) {
	const { id, clubId } = await params;
	if (!id || !clubId) {
		return { error: 'User and Club IDs are required', errStatus: 400 };
	}

	const guesses = await getUserGuesses({
		userId: id,
		clubId,
	});

	return NextResponse.json(guesses);
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<RouteParams> }
) {
	const { id, clubId } = await params;
	if (!id || !clubId) {
		return { error: 'User and Club IDs are required', errStatus: 400 };
	}

	const body = await request.json();
	const { data: nextGuess, error } = guessSchema.safeParse(body);
	if (error)
		return NextResponse.json({ error: z.treeifyError(error) }, { status: 400 });

	const prevGuesses = await getUserGuesses({ userId: id, clubId });
	if (prevGuesses.length >= GUESS_LIMIT)
		return NextResponse.json(
			{ error: 'Max guess limit reached' },
			{ status: 400 }
		);

	const newGuesses = await addUserGuess({ userId: id, clubId }, nextGuess);

	return NextResponse.json(newGuesses);
}

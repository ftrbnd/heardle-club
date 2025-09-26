import { User } from '@/app/actions/_user';
import { getCurrentUser } from '@/app/actions/auth';
import { GUESS_LIMIT } from '@/util/game';
import { addUserGuess, getUserGuesses } from '@repo/database/redis/api';
import { guessSchema } from '@repo/database/redis/schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

type ResponseData = {
	error?: string;
	errStatus?: number;
	user?: User;
	clubId?: string;
};

async function processRequest(request: NextRequest): Promise<ResponseData> {
	const searchParams = request.nextUrl.searchParams;

	const clubId = searchParams.get('clubId');
	if (!clubId) {
		return { error: 'Club ID required', errStatus: 400 };
	}

	const user = await getCurrentUser();
	if (!user) return { error: 'Unauthorized', errStatus: 401 };

	return { user, clubId };
}

export async function GET(request: NextRequest) {
	const res = await processRequest(request);
	if (res.error && res.errStatus)
		return NextResponse.json({ error: res.error }, { status: res.errStatus });

	if (res.user && res.clubId) {
		const guesses = await getUserGuesses({
			userId: res.user.id,
			clubId: res.clubId,
		});

		return NextResponse.json(guesses);
	}
}

export async function PATCH(request: NextRequest) {
	const res = await processRequest(request);
	if (res.error && res.errStatus)
		return NextResponse.json({ error: res.error }, { status: res.errStatus });

	const body = await request.json();
	const { data, error } = guessSchema.safeParse(body);
	if (error)
		return NextResponse.json({ error: z.treeifyError(error) }, { status: 400 });

	const { user, clubId } = res;
	if (user && clubId) {
		const prevGuesses = await getUserGuesses({ userId: user.id, clubId });
		if (prevGuesses.length >= GUESS_LIMIT)
			return NextResponse.json(
				{ error: 'Max guess limit reached' },
				{ status: 400 }
			);

		const newGuesses = await addUserGuess({ userId: user.id, clubId }, data);

		return NextResponse.json(newGuesses);
	}
}

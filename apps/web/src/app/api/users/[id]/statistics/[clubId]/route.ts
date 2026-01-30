import { computeNewStatistics } from '@/util/game';
import {
	getUserStatistics,
	insertUserStatistics,
	updateUserStatistics,
} from '@repo/database/postgres/api';
import { guessesSchema } from '@repo/database/redis/schema';
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

	const statistics = await getUserStatistics(id, clubId);

	return NextResponse.json(statistics);
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
	const { data, error } = z.object({ guesses: guessesSchema }).safeParse(body);
	if (error)
		return NextResponse.json({ error: z.treeifyError(error) }, { status: 400 });

	const existingStats =
		(await getUserStatistics(id, clubId)) ??
		(await insertUserStatistics(id, clubId));

	const newStatistics = computeNewStatistics(existingStats, data.guesses);

	const updatedStatistics = await updateUserStatistics(
		id,
		clubId,
		newStatistics
	);

	return NextResponse.json(updatedStatistics);
}

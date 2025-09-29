import { getUserStatistics } from '@repo/database/postgres/api';
import { NextRequest, NextResponse } from 'next/server';

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

import { getClubDailySong } from '@repo/database/redis/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

	const response = await getClubDailySong(id);
	if (!response) return NextResponse.json({ song: null, url: null });

	const { song, url } = response;
	return NextResponse.json({ song, url });
}

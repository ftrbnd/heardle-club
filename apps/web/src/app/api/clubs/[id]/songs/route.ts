import { getClubSongs } from '@repo/database/postgres/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

	const songs = await getClubSongs(id);
	return NextResponse.json(songs);
}

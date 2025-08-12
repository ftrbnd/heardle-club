import { getArtist } from '@/app/spotify/server.services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	if (!id)
		return NextResponse.json(
			{ error: 'Artist ID is required' },
			{ status: 400 }
		);

	const artist = await getArtist(id);
	return NextResponse.json(artist);
}

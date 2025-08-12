import { getArtistAlbums } from '@/app/api/spotify/server.services';
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

	const albums = await getArtistAlbums(id);
	return NextResponse.json(albums);
}

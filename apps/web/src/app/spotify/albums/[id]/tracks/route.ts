import { getAlbumTracks } from '@/server/actions/spotify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	if (!id)
		return NextResponse.json(
			{ error: 'Album ID is required' },
			{ status: 400 }
		);

	const tracks = await getAlbumTracks(id);
	return NextResponse.json(tracks);
}

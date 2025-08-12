import { searchArtist } from '@/app/api/spotify/server.services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get('query');
	if (!query)
		return NextResponse.json(
			{ error: 'Search query is required' },
			{ status: 400 }
		);

	const artists = await searchArtist(query);
	return NextResponse.json(artists);
}

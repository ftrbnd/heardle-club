import { searchArtist } from '@/server/actions/spotify';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

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

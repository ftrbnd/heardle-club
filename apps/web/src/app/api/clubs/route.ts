import { getClubBySubdomain, searchClubs } from '@repo/database/postgres/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	const subdomain = searchParams.get('subdomain');
	if (subdomain) {
		const club = await getClubBySubdomain(subdomain);
		return NextResponse.json(club);
	}

	const search = searchParams.get('search');
	if (search) {
		const results = await searchClubs(search);
		return NextResponse.json(results);
	}

	return NextResponse.json(
		{ error: 'Subdomain or search query is required' },
		{ status: 400 }
	);
}

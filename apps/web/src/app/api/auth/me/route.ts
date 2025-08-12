import { getCurrentUser } from '@/app/api/auth/server.services';
import { NextResponse } from 'next/server';

export async function GET() {
	const user = await getCurrentUser();

	return NextResponse.json(user);
}

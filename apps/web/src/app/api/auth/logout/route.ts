import { logoutUser } from '@/app/api/auth/server.services';
import { NextResponse } from 'next/server';

export async function GET() {
	await logoutUser();

	return NextResponse.next();
}

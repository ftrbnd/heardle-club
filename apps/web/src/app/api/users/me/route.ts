import { getCurrentUser } from '@/app/actions/auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const user = await getCurrentUser();
	if (!user)
		return NextResponse.json({ error: 'User not found' }, { status: 404 });

	return NextResponse.json(user);
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	console.log(`TODO: implement /users/${id} db query`);

	return NextResponse.json(
		{ error: 'TODO: implement /users/:id db query' },
		{
			status: 404,
		}
	);
}

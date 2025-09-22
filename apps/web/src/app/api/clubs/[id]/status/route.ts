import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

	const status = 0;
	// TODO: do i even use this route?
	return NextResponse.json(status);
}

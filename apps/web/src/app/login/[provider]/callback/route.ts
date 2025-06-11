import { validateCallback } from '@/app/login/[provider]/_handlers';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ provider: string }> }
): Promise<Response> {
	const { provider } = await params;

	if (provider !== 'spotify' && provider !== 'discord')
		return new Response('Provider not supported', { status: 400 });

	return validateCallback(request, provider);
}

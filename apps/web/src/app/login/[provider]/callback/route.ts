import { validateCallback } from '@/app/login/[provider]/_spotify';
import { OAuthProviders } from '@/lib/auth/session';

export async function GET(
	request: Request,
	{ params }: { params: { provider: OAuthProviders } }
): Promise<Response> {
	const { provider } = params;

	switch (provider) {
		case 'spotify':
			return validateCallback(request);
		case 'discord':
		case 'reddit':
		case 'twitter':
			return new Response(`${provider} login not yet implemented`, {
				status: 501,
			});
		default:
			return new Response('Provider not supported', { status: 400 });
	}
}

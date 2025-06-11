import { createAuthorizationURL } from '@/app/login/[provider]/_spotify';
import { OAuthProviders } from '@/lib/auth/session';

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ provider: OAuthProviders }> }
): Promise<Response> {
	const { provider } = await params;

	switch (provider) {
		case 'spotify':
			return createAuthorizationURL();
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

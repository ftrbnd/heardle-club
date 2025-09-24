import { subdomainTabs } from '@/app/(subdomain)/s/[subdomain]/_components/tabs';
import { rootDomain, rootURL } from '@/util/domains';
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function extractSubdomain(request: NextRequest): string | null {
	const url = request.url;
	const host = request.headers.get('host') || '';
	const hostname = host.split(':')[0];

	// Local development environment
	// ensuring client domain doesn't exist means we are not using a tunnel
	if ((!rootDomain && url.includes('localhost')) || url.includes('127.0.0.1')) {
		// Try to extract subdomain from the full URL
		const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
		if (fullUrlMatch && fullUrlMatch[1]) {
			return fullUrlMatch[1];
		}

		// Fallback to host header approach
		if (hostname.includes('.localhost')) {
			return hostname.split('.')[0];
		}

		return null;
	}

	// Production environment
	const rootDomainFormatted = rootDomain.split(':')[0];

	// Handle preview deployment URLs (tenant---branch-name.vercel.app)
	if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
		const parts = hostname.split('---');
		return parts.length > 0 ? parts[0] : null;
	}

	// Regular subdomain detection
	const isSubdomain =
		hostname !== rootDomainFormatted &&
		hostname !== `www.${rootDomainFormatted}` &&
		hostname.endsWith(`.${rootDomainFormatted}`);

	return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

const subdomainTabPaths = subdomainTabs.map((tab) => `/${tab.toLowerCase()}`);

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const subdomain = extractSubdomain(request);

	if (subdomain) {
		if (
			pathname === '/login' ||
			pathname === '/logout' ||
			pathname.startsWith('/account')
		) {
			return NextResponse.redirect(`${rootURL}${pathname}`);
		}

		if (subdomainTabPaths.includes(pathname)) {
			return NextResponse.rewrite(
				new URL(`/s/${subdomain}/t${pathname}`, request.url)
			);
		}

		// For any other path on a subdomain, rewrite to the subdomain page
		return NextResponse.rewrite(
			new URL(`/s/${subdomain}${pathname}`, request.url)
		);
	}

	const c = await cookies();

	if (pathname === '/login') {
		const referrer = request.headers.get('referer');
		c.set('login_referrer', referrer ?? rootURL, {
			domain: rootDomain,
			sameSite: 'lax',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		});
	}

	// On the root domain, allow normal access
	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all paths except for:
		 * 1. /api routes
		 * 2. /_next (Next.js internals)
		 * 3. all root files inside /public (e.g. /favicon.ico)
		 */
		'/((?!api|_next|[\\w-]+\\.\\w+).*)',
	],
};

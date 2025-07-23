export const rootDomain =
	process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
export const rootDomainExists =
	process.env.NEXT_PUBLIC_ROOT_DOMAIN !== undefined;

export const protocol =
	process.env.NODE_ENV === 'production' || rootDomainExists ? 'https' : 'http';

export const rootURL = `${protocol}://${rootDomain}` as const;
export const getSubdomainURL = (subdomain: string) =>
	`${protocol}://${subdomain}.${rootDomain}` as const;

export const serverURL = `${protocol}://api.${rootDomain}`;
export const authURL = `${serverURL}/auth` as const;

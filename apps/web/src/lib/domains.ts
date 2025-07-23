export const clientProtocol =
	process.env.NODE_ENV === 'production' || process.env.CLIENT_DOMAIN
		? 'https'
		: 'http';
export const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || 'localhost:3000';
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || CLIENT_DOMAIN;
export const CLIENT_URL = `${clientProtocol}://${ROOT_DOMAIN}` as const;
export const getSubdomainUrl = (subdomain: string) =>
	`${clientProtocol}://${subdomain}.${CLIENT_DOMAIN}` as const;

export const serverProtocol = process.env.SERVER_DOMAIN ? 'https' : 'http';
export const SERVER_DOMAIN = process.env.SERVER_DOMAIN || 'localhost:3001';
export const SERVER_URL = `${serverProtocol}://${SERVER_DOMAIN}`;
export const AUTH_URL = `${SERVER_URL}/auth` as const;

import 'dotenv/config';

export const rootDomain = process.env.ROOT_DOMAIN || 'localhost:3000';
export const rootDomainExists = process.env.ROOT_DOMAIN !== undefined;

export const protocol =
	process.env.NODE_ENV === 'production' || rootDomainExists ? 'https' : 'http';
export const serverPort = 3001;

export const serverDomain = rootDomainExists
	? (`api.${rootDomain}` as const)
	: (`localhost:${serverPort}` as const);

export const spotifyRedirectURI =
	`${protocol}://${serverDomain}/auth/login/spotify/callback` as const;
export const discordRedirectURI =
	`${protocol}://${serverDomain}/auth/login/discord/callback` as const;

export const rootURL = `${protocol}://${rootDomain}` as const;

import 'dotenv/config';

export const serverProtocol =
	process.env.NODE_ENV === 'production' || process.env.NGROK_DOMAIN
		? 'https'
		: 'http';
export const SERVER_PORT = 3001;

export const SERVER_DOMAIN =
	process.env.NGROK_DOMAIN ?? `localhost:${SERVER_PORT}`;

export const SPOTIFY_REDIRECT_URI =
	`${serverProtocol}://${SERVER_DOMAIN}/auth/login/spotify/callback` as const;
export const DISCORD_REDIRECT_URI =
	`${serverProtocol}://${SERVER_DOMAIN}/auth/login/discord/callback` as const;

export const clientProtocol = process.env.CLIENT_DOMAIN ? 'https' : 'http';
export const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN ?? 'localhost:3000';
export const CLIENT_URL = `${clientProtocol}://${CLIENT_DOMAIN}` as const;

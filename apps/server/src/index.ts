import 'dotenv/config';

import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { cronPlugin } from '@/utils/cron';
import { customSongs } from '@/modules/custom-songs';
import { clubs } from '@/modules/clubs';
import { auth } from '@/modules/auth';
import ngrok from '@ngrok/ngrok';

const PORT = 3001;

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.use(auth)
	.use(cronPlugin)
	.use(clubs)
	.use(customSongs)
	.listen(PORT, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}${port}`);
	});

async function setupNgrok() {
	const listener = await ngrok.forward({
		addr: PORT,
		authtoken_from_env: true,
		domain: process.env.NGROK_DOMAIN,
	});

	console.log(`Ingress established at: ${listener.url()}`);
}

setupNgrok();

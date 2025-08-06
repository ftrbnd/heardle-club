import 'dotenv/config';

import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { cronPlugin } from '@/utils/cron';
import { customSongs } from '@/modules/custom-songs';
import { clubs } from '@/modules/clubs';
import { auth } from '@/modules/auth';
import { serverPort } from '@/utils/domains';
import cors from '@elysiajs/cors';

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.use(
		cors({
			origin: true,
		})
	)
	.use(auth)
	.use(cronPlugin)
	.use(clubs)
	.use(customSongs)
	.listen(serverPort, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}${port}`);
	});

import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import cors from '@elysiajs/cors';
import { auth } from '@/server/modules/auth';
import { cronPlugin } from '@/server/utils/cron';
import { clubs } from '@/server/modules/clubs';
import { customSongs } from '@/server/modules/custom-songs';

export const server = new Elysia({ adapter: node() })
	.onError(({ path, error }) => {
		console.log({ path, error });
	})
	.get('/', () => 'Hello Elysia')
	.use(
		cors({
			origin: true,
		})
	)
	.use(auth)
	.use(cronPlugin)
	.use(clubs)
	.use(customSongs);

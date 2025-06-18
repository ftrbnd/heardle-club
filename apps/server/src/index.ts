import 'dotenv/config';

import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import cron from '@elysiajs/cron';
import { customSongs } from './modules/custom-songs';
import { resetAllClubs } from '@/utils/cron';

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.use(
		cron({
			name: 'daily',
			pattern: '0 4 * * *',
			async run() {
				await resetAllClubs();
			},
		})
	)
	.use(customSongs)
	.listen(3001, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});

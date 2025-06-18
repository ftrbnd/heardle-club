import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { customSongs } from './modules/custom-songs';

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.use(customSongs)
	.listen(3001, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});

import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import cors from '@elysiajs/cors';
import { auth } from '@/elysia/modules/auth';
import { clubs } from '@/elysia/modules/clubs';
import { customSongs } from '@/elysia/modules/custom-songs';
import { rootDomain, rootDomainExists } from '@/elysia/utils/domains';

export const elysia = new Elysia({ adapter: node() })
	.onError(({ path, error }) => {
		console.log({ path, error });
	})
	.get('/', () => 'Hello Elysia')
	.use(
		cors({
			origin: ({ headers }) => {
				if (rootDomainExists) {
					const ref = headers.get('Referer');
					return ref?.includes(rootDomain);
				}
				return true;
			},
		})
	)
	.use(auth)
	.use(clubs)
	.use(customSongs);

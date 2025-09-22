import 'dotenv/config';

import { elysia } from '@/elysia';
import { serverPort } from '@/elysia/utils/domains';

elysia.listen(serverPort, ({ hostname, port }) => {
	console.log(`🦊 Elysia is running at ${hostname}${port}`);
});

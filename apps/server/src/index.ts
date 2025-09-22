import 'dotenv/config';

import { server } from '@/server';
import { serverPort } from '@/server/utils/domains';

server.listen(serverPort, ({ hostname, port }) => {
	console.log(`🦊 Elysia is running at ${hostname}${port}`);
});

import 'dotenv/config';

import { Worker } from 'bullmq';
import { connection, processorFile, QUEUE_NAME } from '@/workers/config';

function createWorker() {
	const worker = new Worker(QUEUE_NAME, processorFile, {
		connection,
	});

	worker.on('ready', () => console.log(`"${worker.name}" worker ready`));

	return worker;
}

createWorker();

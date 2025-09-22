import { ConnectionOptions } from 'bullmq';

const host = process.env.UPSTASH_REDIS_REST_URL!.replace('https://', '');

export const connection: ConnectionOptions = {
	host,
	port: 6379,
	password: process.env.UPSTASH_REDIS_REST_TOKEN,
	tls: {},
};

import { redis } from '@/lib/redis';

export async function getSubdomainName(subdomain: string) {
	const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
	const data = await redis.get<string>(`subdomain:${sanitizedSubdomain}`);
	return data;
}

export async function getAllSubdomains() {
	const keys = await redis.keys('subdomain:*');

	if (!keys.length) {
		return [];
	}

	const values = await redis.mget<string[]>(...keys);

	return keys.map((key, index) => {
		const subdomain = key.replace('subdomain:', '');
		const name = values[index];

		return {
			subdomain,
			name,
		};
	});
}

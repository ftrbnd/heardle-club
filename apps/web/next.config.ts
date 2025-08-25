import type { NextConfig } from 'next';

const supabaseUrl = process.env.SUPABASE_URL!;

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL('https://i.scdn.co/image/**'),
			new URL('https://img.daisyui.com/**'),
			new URL(`${supabaseUrl}/**`),
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
};

export default nextConfig;

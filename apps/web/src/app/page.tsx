import Link from 'next/link';
import { protocol, rootDomain } from '@/lib/utils';
import { getAllSubdomains } from '@/lib/subdomains';

export default async function HomePage() {
	const subdomains = await getAllSubdomains();

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative'>
			<div className='w-full max-w-md space-y-8'>
				<div className='text-center'>
					<h1 className='text-4xl font-bold tracking-tight text-gray-900'>
						{rootDomain}
					</h1>
					<p className='mt-3 text-lg text-gray-600'>Create your own Club</p>
				</div>

				<div className='mt-8 bg-white shadow-md rounded-lg p-6'>
					<h2 className='text-2xl font-bold tracking-tight text-gray-900'>
						Active Clubs
					</h2>
					<ul>
						{subdomains.map(({ subdomain, name }) => (
							<Link
								className='text-gray-900 underline'
								key={subdomain}
								href={`${protocol}://${subdomain}.${rootDomain}`}>
								{name}
							</Link>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

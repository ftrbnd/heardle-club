import { Navbar } from '@/components/navbar';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}

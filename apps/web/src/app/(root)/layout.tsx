import { Navbar } from '@/components/layout/navbar';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}

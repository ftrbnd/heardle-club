import './globals.css';
import { Footer } from '@/server/components/layout/footer';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/client/providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Heardle Club',
	description: "Find your favorite artist's Heardle!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen w-full`}>
				<Providers>
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}

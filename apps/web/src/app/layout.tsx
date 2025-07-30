import { Alert } from '@/components/icons/alert';
import './globals.css';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

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
				<Toaster
					icons={{
						success: <Alert type='success' />,
						info: <Alert type='info' />,
						warning: <Alert type='warning' />,
						error: <Alert type='error' />,
						loading: <Alert type='loading' />,
					}}
				/>
				{children}
				<Footer />
			</body>
		</html>
	);
}

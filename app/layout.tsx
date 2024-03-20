import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';

import { cn } from '@/lib/utils';

import './globals.css';
import Navbar from './components/Navbar';
import Providers from './components/providers/Providers';

const NunitoSans = Nunito_Sans({
	weight: ['400', '700'],
	subsets: ['latin'],
	style: ['normal', 'italic'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Digital Marketplace',
	description: 'Digital Marketplace',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='h-full'>
			<body
				className={cn(
					'relative h-full font-sans antialiased',
					NunitoSans.className,
				)}
			>
				<main className='relative flex flex-col min-h-screen'>
					<Providers>
						<Navbar />
						<div className='flex-grow flex-1'>{children}</div>
					</Providers>
				</main>
			</body>
		</html>
	);
}

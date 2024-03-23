import { Nunito_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

import { cn, constructMetadata } from '@/lib/utils';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Providers from './components/providers/Providers';

import './globals.css';

const NunitoSans = Nunito_Sans({
	weight: ['400', '700'],
	subsets: ['latin'],
	style: ['normal', 'italic'],
	display: 'swap',
});

export const metadata = constructMetadata();

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
						<Footer />
					</Providers>
				</main>

				<Toaster position='top-center' richColors />
			</body>
		</html>
	);
}

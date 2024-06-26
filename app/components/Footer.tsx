'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import MaxWidthWrapper from './MaxWidthWrapper';

const Footer = () => {
	const pathname = usePathname();
	const pathToMinimize = [
		'/sign-in',
		'/sign-up',
		'/verify-email',
	];

	return (
		<footer className='bg-white flex-grow-0'>
			<MaxWidthWrapper>
				<div className='border-t border-gray-200'>
					{pathToMinimize.includes(pathname) ? null : (
						<div className='pb-4 pt-8'>
							<div className='flex justify-center'>
								<div className='relative w-16 h-16 text-muted-foreground'>
									<Image
										src='/online-shop-logo.jpg'
										alt='eCommerce logo'
										fill
									/>
								</div>
							</div>
						</div>
					)}

					{pathToMinimize.includes(pathname) ? null : (
						<div>
							<div className='relative flex items-center px-4 py-4 sm:py-6 lg:mt-0'>
								<div className='absolute inset-0 overflow-hidden rounded-lg'>
									<div
										arial-hidden='true'
										className='absolute bg-zinc-100 inset-0 bg-gradient-to-br bg-opacity-90'
									/>
								</div>

								<div className='text-center relative mx-auto max-w-sm'>
									<h3 className='font-semibold text-gray-900'>
										Become a seller
									</h3>
									<p className='mt-2 text-sm text-muted-foreground'>
										If you&apos;d like to sell high-quality
										digital products, you can do so in
										minutes.{' '}
										<Link
											href='/sign-in?as=seller'
											className='whitespace-nowrap font-medium text-black hover:text-zinc-900'
										>
											Get started &rarr;
										</Link>
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='py-4 md:flex md:items-center md:justify-between'>
					<div className='text-center md:text-left'>
						<p className='text-sm text-muted-foreground'>
							&copy; {new Date().getFullYear()} All Rights
							Reserved
						</p>
					</div>

					<div className='mt-4 flex items-center justify-center md:mt-0'>
						<div className='flex space-x-8'>
							<Link
								href='#'
								className='text-sm text-muted-foreground hover:text-gray-600'
							>
								Terms
							</Link>
							<Link
								href='#'
								className='text-sm text-muted-foreground hover:text-gray-600'
							>
								Privacy Policy
							</Link>
							<Link
								href='#'
								className='text-sm text-muted-foreground hover:text-gray-600'
							>
								Cookie Policy
							</Link>
						</div>
					</div>
				</div>
			</MaxWidthWrapper>
		</footer>
	);
};

export default Footer;

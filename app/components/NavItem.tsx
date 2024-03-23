'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { PRODUCT_CATEGORIES } from '@/helpers';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';

type Category = (typeof PRODUCT_CATEGORIES)[number];

interface NavItemProps {
	category: Category;
	handleOpen: () => void;
	close: () => void;
	isOpen: boolean;
	isAnyOpen: boolean;
}

const NavItem = ({
	category,
	handleOpen,
	close,
	isAnyOpen,
	isOpen,
}: NavItemProps) => {
	return (
		<div className='flex'>
			<div className='relative flex items-center'>
				<Button
					className='gap-1.5'
					onClick={handleOpen}
					variant={isOpen ? 'secondary' : 'ghost'}
				>
					{category.label}
					<ChevronDown
						className={cn('h-4 w-4 transition-all text-muted-foreground', {
							'-rotate-180': isOpen,
						})}
					/>
				</Button>
			</div>

			{isOpen ? (
				<div
					onClick={() => close()}
					className={cn(
						'absolute inset-x-0 top-full text-sm text-muted-foreground',
						{
							'animate-in face-in-10 slide-in-from-top-5': !isAnyOpen,
						},
					)}
				>
					<div
						className='absolute inset-0 top-1/2 bg-white shadow'
						aria-hidden='true'
					/>

					<div className='relative bg-white '>
						<div className='mx-auto max-w-7xl px-8'>
							<div className='grid grid-cols-4 gap-x-8 gap-y-10 py-16'>
								<div className='col-span-4 col-start-1 grid grid-cols-3 gap-x-8 '>
									{category.featured.map((item) => (
										<div
											onClick={() => close}
											key={item.name}
											className='group relative text-base sm:text-sm'
										>
											<div className='relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'>
												<Image
													src={item.imageSrc}
													alt='Product category image'
													fill
													className='h-full w-full object-cover object-center'
												/>
											</div>
											<Link
												href={item.href}
												className='mt-6 block font-medium text-gray-900'
											>
												{item.name}
											</Link>
											<p className='mt-1' aria-hidden='true'>
												Shop now
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default NavItem;

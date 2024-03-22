'use client';

import { PRODUCT_CATEGORIES } from '@/helpers';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Page = () => {
	const { items, removeItem } = useCart();

	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className='bg-white'>
			<div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
				<h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
					Shopping Cart
				</h1>

				<div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
					<div
						className={cn('lg:col-span-7', {
							'rounded-lg border-2 border-dashed border-zinc-200 p-12':
								isMounted && items.length === 0,
						})}
					>
						<h2 className='sr-only'>Items in your shopping cart</h2>

						{isMounted && items.length === 0 ? (
							<div className='flex h-full flex-col items-center justify-center space-y-1'>
								<div
									aria-hidden='true'
									className='relative mb-4 h-40 w-40 text-muted-foreground'
								>
									<Image
										src='/hippo-empty-cart.png'
										fill
										loading='eager'
										alt='empty shopping cart'
									/>
								</div>
								<h3 className='font-semibold text-2xl'>Your cart is empty</h3>
								<p className='text-muted-foreground text-center'>
									whoops! Nothing to show here yet.
								</p>
							</div>
						) : null}

						<ul
							className={cn({
								'divide-y divide-gray-200 border-b border-t border-gray-200':
									isMounted && items.length > 0,
							})}
						>
							{isMounted &&
								items.map(({ product }) => {
									const label = PRODUCT_CATEGORIES.find(
										(cty) => cty.value === product.category,
									)?.label;

									const { image } = product.images[0];

									return (
										<li key={product.id} className='flex py-6 sm:py-10'>
											<div className='flex-shrink-0'>
												<div className='relative h-24 w-24'>
													{typeof image !== 'string' && image.url ? (
														<Image
															fill
															src={image.url}
															alt='product image'
															className='h-full w-full rounded-md object-cover object-center'
														/>
													) : null}
												</div>
											</div>

											<div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
												<div className='relative pr-9 sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
													<div className=''>
														<div className='flex justify-between'>
															<h3 className='text-sm'>
																<Link
																	href={`/product/${product.id}`}
																	className='font-medium text-gray-700 hover:text-gray-800'
																>
																	{product.name}
																</Link>
															</h3>
														</div>
													</div>
												</div>
											</div>
										</li>
									);
								})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;

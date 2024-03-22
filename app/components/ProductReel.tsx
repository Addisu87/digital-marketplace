'use client';

import Link from 'next/link';

import { trpc } from '@/trpc/client';
import ProductListing from './ProductListing';
import { Product } from '@/payload-types';
import { TQueryValidator } from '@/lib/validators/query-validator';

interface ProductReelProps {
	title: string;
	subtitle?: string;
	href?: string;
	query: TQueryValidator;
}

const FALLBACK_LIMIT = 4;

const ProductReel = (props: ProductReelProps) => {
	const { title, subtitle, href, query } = props;

	const { data: queryResults, isLoading } =
		trpc.getInfiniteProducts.useInfiniteQuery(
			{
				limit: query.limit ?? FALLBACK_LIMIT,
				query,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextPage,
			},
		);

	const products = queryResults?.pages.flatMap((page) => page.items);

	let prods: (Product | null)[] = [];
	if (products && products.length) {
		prods = products;
	} else if (isLoading) {
		prods = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
	}

	return (
		<section className='py-12'>
			<div
				className='md:flex md:items-center md:just
      ify-between mb-4'
			>
				<div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
					{title ? (
						<h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
							{title}
						</h1>
					) : null}
					{subtitle ? (
						<p className='mt-2 text-sm text-muted-foreground'>{title}</p>
					) : null}
				</div>

				{href ? (
					<Link
						href={href}
						className='hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block'
					>
						Shop the collection <span aria-hidden='true'> &rarr;</span>
					</Link>
				) : null}
			</div>

			<div className='relative'>
				<div className='mt-6 flex items-center justify-center'>
					<div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8'>
						{prods.map((product, i) => (
							<ProductListing
								key={`product-${i}`}
								product={product}
								index={i}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProductReel;

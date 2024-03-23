import * as React from 'react';

import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Section,
	Column,
	Img,
	Text,
	Row,
	Link,
	Hr,
	render,
} from '@react-email/components';
import { format } from 'date-fns';

import { Product } from '../../../payload-types';
import { formatPrice } from '../../../lib/utils';

interface ReceiptEmailProps {
	email: string;
	date: Date;
	orderId: string;
	products: Product[];
}

export const ReceiptEmail = ({
	email,
	date,
	orderId,
	products,
}: ReceiptEmailProps) => {
	const total = products.reduce((acc, curr) => acc + curr.price, 0) + 1;

	return (
		<Html>
			<Head />
			<Preview>Your DigitalMarketPlace Receipt</Preview>

			<Body className='font-sans bg-white'>
				<Container className='mx-auto py-20 px-0 max-w-4xl'>
					<Section className='mb-4'>
						<Column>
							<Img
								src={`${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-email-sent.png`}
								width='100'
								height='100'
								alt='DigitalMarketPlace'
							/>
						</Column>

						<Column className='text-right' align='right'>
							<Text className='text-2xl font-light text-gray-600'>Receipt</Text>
						</Column>
					</Section>
					<Section className='bg-gray-100 rounded-lg text-sm mt-6'>
						<Row className='h-12'>
							<Column className='border-r border-b px-4 py-2'>
								<Text className='font-semibold text-gray-600'>EMAIL</Text>
								<Link className='text-blue-500'>{email}</Link>
							</Column>

							<Column className='border-r border-b px-4 py-2'>
								<Text className='font-semibold text-gray-600'>
									INVOICE DATE
								</Text>
								<Text>{format(date, 'dd MMM yyyy')}</Text>
							</Column>

							<Column className='px-4 py-2'>
								<Text className='font-semibold text-gray-600'>ORDER ID</Text>
								<Link className='text-blue-500'>{orderId}</Link>
							</Column>
						</Row>
					</Section>
					<Section className='bg-gray-100 rounded-lg text-sm mt-8'>
						<Text className='bg-gray-200 px-2 py-1 font-semibold'>
							Order Summary
						</Text>
						{products.map((product) => {
							const { image } = product.images[0];

							return (
								<Section key={product.id} className='flex items-center py-2'>
									<Column className='w-16'>
										{typeof image !== 'string' && image.url ? (
											<Img
												src={image.url}
												width='64'
												height='64'
												alt='Product Image'
												className='rounded-lg border border-gray-200'
											/>
										) : null}
									</Column>
									<Column className='pl-4'>
										<Text className='font-semibold'>{product.name}</Text>
										{product.description ? (
											<Text className='text-gray-600'>
												{product.description.length > 50
													? product.description?.slice(0, 50) + '...'
													: product.description}
											</Text>
										) : null}
										<Link
											href={`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`}
											className='text-blue-500'
										>
											Download Asset
										</Link>
									</Column>

									<Column className='w-32 text-right' align='right'>
										<Text className='font-semibold'>{product.price}</Text>
									</Column>
								</Section>
							);
						})}

						<Section className='flex items-center py-2'>
							<Column className='w-16'></Column>
							<Column className='pl-4'>
								<Text className='font-semibold'>Transaction Fee</Text>
							</Column>

							<Column className='w-32 text-right'>
								<Text className='font-semibold'>{formatPrice(1)}</Text>
							</Column>
						</Section>
					</Section>

					<Hr className='my-6' />
					<Section className='flex justify-end'>
						<Column className='text-right'>
							<Text className='font-semibold text-gray-600'>TOTAL</Text>
						</Column>
						<Column className='border-l'></Column>
						<Column className='flex-grow text-right'>
							<Text className='font-semibold text-xl'>
								{formatPrice(total)}
							</Text>
						</Column>
					</Section>
					<Hr className='my-6' />

					<Text className='text-center text-sm text-gray-600'>
						<Link href='#'>Account Settings</Link> •{' '}
						<Link href='#'>Terms of Sale</Link> •{' '}
						<Link href='#'>Privacy Policy </Link>
					</Text>
					<Text className='text-center text-sm text-gray-600 mt-4'>
						Copyright © 2023 DigitalHippo Inc. <br />{' '}
						<Link href='#'>All rights reserved</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

export const ReceiptEmailHtml = (props: ReceiptEmailProps) =>
	render(<ReceiptEmail {...props} />, {
		pretty: true,
	});

import type Stripe from 'stripe';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { getPayloadClient } from '../get-payload';
import { privateProcedure, router } from './trpc';
import { stripe } from '../lib/stripe';

export const paymentRouter = router({
	// for creating a checkout session with Stripe
	createSession: privateProcedure
		.input(z.object({ productIds: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			const { user } = ctx;
			let { productIds } = input;

			if (productIds.length === 0) {
				throw new TRPCError({ code: 'BAD_REQUEST' });
			}

			const payload = await getPayloadClient();

			const { docs: products } = await payload.find({
				collection: 'products',
				where: {
					id: {
						in: productIds,
					},
				},
			});

			const filteredProducts = products.filter((prod) =>
				Boolean(prod.priceId),
			);

			if (filteredProducts.length === 0) {
				throw new Error('No valid product found');
			}

			const order = await payload.create({
				collection: 'orders',
				data: {
					_isPaid: false,
					products: filteredProducts.map((prod) => prod.id),
					user: user.id,
				},
			});

			const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
				[];

			filteredProducts.forEach((product) => {
				line_items.push({
					price: product.priceId!,
					quantity: 1,
				});
			});

			// Transaction fee
			line_items.push({
				price: 'price_1P1qHKFnJPipKlpGoPVcHHRg',
				quantity: 1,
				adjustable_quantity: {
					enabled: false,
				},
			});

			try {
				const stripeSession =
					await stripe.checkout.sessions.create({
						success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
						cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
						payment_method_types: ['card'],
						mode: 'payment',
						metadata: {
							userId: user.id,
							orderId: order.id,
						},
						line_items,
					});

				// Return the session URL if creation is successful
				return { url: stripeSession.url };
			} catch (error) {
				// Log or handle the error more explicitly
				console.error(
					'Error creating Stripe session:',
					error,
				);
				return { url: null };
			}
		}),
	// query is used to check the status of an order
	pollOrderStatus: privateProcedure
		.input(z.object({ orderId: z.string() }))
		.query(async ({ input }) => {
			const { orderId } = input;

			const payload = await getPayloadClient();

			const { docs: orders } = await payload.find({
				collection: 'orders',
				where: {
					id: {
						equals: orderId,
					},
				},
			});

			if (!orders.length) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			const [order] = orders;

			return { isPaid: order._isPaid };
		}),
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const get_payload_1 = require("../get-payload");
const trpc_1 = require("./trpc");
const stripe_1 = require("../lib/stripe");
exports.paymentRouter = (0, trpc_1.router)({
    // for creating a checkout session with Stripe
    createSession: trpc_1.privateProcedure
        .input(zod_1.z.object({ productIds: zod_1.z.array(zod_1.z.string()) }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const { user } = ctx;
        let { productIds } = input;
        if (productIds.length === 0) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST' });
        }
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const { docs: products } = yield payload.find({
            collection: 'products',
            where: {
                id: {
                    in: productIds,
                },
            },
        });
        const filteredProducts = products.filter((prod) => Boolean(prod.priceId));
        if (filteredProducts.length === 0) {
            throw new Error('No valid product found');
        }
        const order = yield payload.create({
            collection: 'orders',
            data: {
                _isPaid: false,
                products: filteredProducts.map((prod) => prod.id),
                user: user.id,
            },
        });
        const line_items = [];
        filteredProducts.forEach((product) => {
            line_items.push({
                price: product.priceId,
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
            const stripeSession = yield stripe_1.stripe.checkout.sessions.create({
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
        }
        catch (error) {
            // Log or handle the error more explicitly
            console.error('Error creating Stripe session:', error);
            return { url: null };
        }
    })),
    // query is used to check the status of an order
    pollOrderStatus: trpc_1.privateProcedure
        .input(zod_1.z.object({ orderId: zod_1.z.string() }))
        .query((_b) => __awaiter(void 0, [_b], void 0, function* ({ input }) {
        const { orderId } = input;
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const { docs: orders } = yield payload.find({
            collection: 'orders',
            where: {
                id: {
                    equals: orderId,
                },
            },
        });
        if (!orders.length) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
        const [order] = orders;
        return { isPaid: order._isPaid };
    })),
});

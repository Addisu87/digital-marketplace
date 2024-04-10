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
exports.stripeWebhookHandler = void 0;
const resend_1 = require("resend");
const stripe_1 = require("./lib/stripe");
const get_payload_1 = require("./get-payload");
const ReceiptEmail_1 = require("./app/components/email/ReceiptEmail");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const webhookRequest = req;
    const body = webhookRequest.rawBody;
    const signature = req.headers['stripe-signature'] || '';
    // validate request actually comes from stripe
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
    }
    catch (err) {
        return res
            .status(400)
            .send(`Webhook Error: ${err instanceof Error
            ? err.message
            : 'Unknown Error'}`);
    }
    const session = event.data
        .object;
    // update the _isPaid value of this order
    if (!((_a = session === null || session === void 0 ? void 0 : session.metadata) === null || _a === void 0 ? void 0 : _a.userId) ||
        !((_b = session === null || session === void 0 ? void 0 : session.metadata) === null || _b === void 0 ? void 0 : _b.orderId)) {
        return res
            .status(400)
            .send(`Webhook Error: No user present in metadata`);
    }
    if (event.type === 'checkout.session.completed') {
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const { docs: users } = yield payload.find({
            collection: 'users',
            where: {
                id: {
                    equals: session.metadata.userId,
                },
            },
        });
        const [user] = users;
        if (!user)
            return res
                .status(404)
                .json({ error: 'No such user exists.' });
        const { docs: orders } = yield payload.find({
            collection: 'orders',
            depth: 2,
            where: {
                id: {
                    equals: session.metadata.orderId,
                },
            },
        });
        const [order] = orders;
        if (!order)
            return res
                .status(404)
                .json({ error: 'No such order exists.' });
        yield payload.update({
            collection: 'orders',
            data: {
                _isPaid: true,
            },
            where: {
                id: {
                    equals: session.metadata.orderId,
                },
            },
        });
        // send receipt
        try {
            const data = yield resend.emails.send({
                from: 'DigitalMarketPlace <onboarding@resend.dev>',
                to: [user.email],
                subject: 'Thanks for your order! This is your receipt.',
                html: (0, ReceiptEmail_1.ReceiptEmailHtml)({
                    date: new Date(),
                    email: user.email,
                    orderId: session.metadata.orderId,
                    products: order.products,
                }),
            });
            res.status(200).json({ data });
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }
    return res.status(200).send();
});
exports.stripeWebhookHandler = stripeWebhookHandler;

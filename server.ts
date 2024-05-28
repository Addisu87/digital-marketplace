import express from 'express';
import { IncomingMessage } from 'http';
import { inferAsyncReturnType } from '@trpc/server';
import { parse } from 'url';
import bodyParser from 'body-parser';
import path from 'path';
import { PayloadRequest } from 'payload/types';

import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import { stripeWebhookHandler } from './webhooks';
import nextBuild from 'next/dist/build';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => ({
	req,
	res,
});

export type ExpressContext = inferAsyncReturnType<
	typeof createContext
>;

export type WebhookRequest = IncomingMessage & {
	rawBody: Buffer;
};

const start = async () => {
	const webhookMiddleware = bodyParser.json({
		verify: (req: WebhookRequest, _, buffer) => {
			req.rawBody = buffer;
		},
	});

	app.post(
		'/api/webhooks/stripe',
		webhookMiddleware,
		stripeWebhookHandler,
	);

	const payload = await getPayloadClient({
		initOptions: {
			express: app,
			onInit: async (cms) => {
				cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
			},
		},
	});

	if (process.env.NEXT_BUILD) {
		payload.logger.info(
			'Next.js is building for production',
		);

		try {
			// @ts-expect-error
			await nextBuild(path.join(__dirname, '../'));
			payload.logger.info('Next.js build completed');
		} catch (error) {
			payload.logger.error('Next.js build failed', error);
			process.exit(1);
		}

		process.exit();
	} else {
		const cartRouter = express.Router();

		cartRouter.use(payload.authenticate);

		cartRouter.get('/', (req, res) => {
			const request = req as PayloadRequest;

			if (!request.user)
				return res.redirect('/sign-in?origin=cart');

			const parsedUrl = parse(req.url, true);
			const { query } = parsedUrl;

			return nextApp.render(req, res, '/cart', query);
		});

		app.use('/cart', cartRouter);
		app.use(
			'/api/trpc',
			trpcExpress.createExpressMiddleware({
				router: appRouter,
				createContext,
			}),
		);

		app.use((req, res) => nextHandler(req, res));

		nextApp
			.prepare()
			.then(() => {
				payload.logger.info('Next.js started');

				app.listen(PORT, async () => {
					payload.logger.info(
						`Server running on http://localhost:${PORT}`,
					);
					payload.logger.info(
						`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`,
					);
				});
			})
			.catch((err) => {
				payload.logger.error(
					'Next.js failed to start',
					err,
				);
			});
	}
};

start().catch((err) => {
	console.error('Failed to start the application', err);
});

import express from 'express';
import bodyParser from 'body-parser';
import { IncomingMessage } from 'http';

import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';
import { appRouter } from './trpc';
import { stripeWebhookHandler } from './webhooks';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => ({
	req,
	res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

export type webhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
	const webhookMiddleware = bodyParser.json({
		verify: (req: webhookRequest, _, buffer) => {
			req.rawBody = buffer;
		},
	});

	app.post('/api/webhooks/stripe', webhookMiddleware, stripeWebhookHandler);
	const payload = await getPayloadClient({
		initOptions: {
			express: app,
			onInit: async (cms) => {
				cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
			},
		},
	});

	app.use(
		'/api/trpc',
		trpcExpress.createExpressMiddleware({
			router: appRouter,
			createContext,
		}),
	);

	app.use((req, res) => nextHandler(req, res));

	nextApp.prepare().then(() => {
		payload.logger.info('Next.js started');

		app.listen(PORT, async () => {
			payload.logger.info(
				`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`,
			);
		});
	});
};

start();

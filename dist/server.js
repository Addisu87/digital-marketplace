"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_1 = require("url");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const get_payload_1 = require("./get-payload");
const next_utils_1 = require("./next-utils");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const trpc_1 = require("./trpc");
const webhooks_1 = require("./webhooks");
const build_1 = __importDefault(require("next/dist/build"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
const createContext = ({ req, res, }) => ({
    req,
    res,
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const webhookMiddleware = body_parser_1.default.json({
        verify: (req, _, buffer) => {
            req.rawBody = buffer;
        },
    });
    app.post('/api/webhooks/stripe', webhookMiddleware, webhooks_1.stripeWebhookHandler);
    const payload = yield (0, get_payload_1.getPayloadClient)({
        initOptions: {
            express: app,
            onInit: (cms) => __awaiter(void 0, void 0, void 0, function* () {
                cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
            }),
        },
    });
    if (process.env.NEXT_BUILD) {
        app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
            payload.logger.info('Next.js is building for production');
            // @ts-expect-error
            yield (0, build_1.default)(path_1.default.join(__dirname, './'));
            process.exit();
        }));
        return;
    }
    const cartRouter = express_1.default.Router();
    cartRouter.use(payload.authenticate);
    cartRouter.get('/', (req, res) => {
        const request = req;
        if (!request.user)
            return res.redirect('/sign-in?origin=cart');
        const parsedUrl = (0, url_1.parse)(req.url, true);
        const { query } = parsedUrl;
        return next_utils_1.nextApp.render(req, res, '/cart', query);
    });
    app.use('/cart', cartRouter);
    app.use('/api/trpc', trpcExpress.createExpressMiddleware({
        router: trpc_1.appRouter,
        createContext,
    }));
    app.use((req, res) => (0, next_utils_1.nextHandler)(req, res));
    next_utils_1.nextApp.prepare().then(() => {
        payload.logger.info('Next.js started');
        app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
            payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
        }));
    });
});
start();

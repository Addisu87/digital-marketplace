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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const payload_1 = __importDefault(require("payload"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, './.env'),
});
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
    },
});
let cached = global.payload;
if (!cached) {
    cached = global.payload = {
        client: null,
        promise: null,
    };
}
const getPayloadClient = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* ({ initOptions, } = {}) {
    if (!process.env.PAYLOAD_SECRET) {
        throw new Error('PAYLOAD_SECRET is missing');
    }
    if (cached.client) {
        return cached.client;
    }
    if (!cached.promise) {
        cached.promise = payload_1.default.init(Object.assign({ email: {
                transport: transporter,
                fromAddress: 'onboarding@resend.dev',
                fromName: 'DigitalMarketplace',
            }, secret: process.env.PAYLOAD_SECRET, local: (initOptions === null || initOptions === void 0 ? void 0 : initOptions.express) ? false : true }, (initOptions || {})));
    }
    try {
        cached.client = yield cached.promise;
    }
    catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.client;
});
exports.getPayloadClient = getPayloadClient;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("payload/config");
const richtext_slate_1 = require("@payloadcms/richtext-slate");
const bundler_webpack_1 = require("@payloadcms/bundler-webpack");
const db_mongodb_1 = require("@payloadcms/db-mongodb");
const Users_1 = require("./collections/Users");
const Products_1 = require("./collections/Products/Products");
const Media_1 = require("./collections/Media");
const Orders_1 = require("./collections/Orders");
const ProductFile_1 = require("./collections/ProductFile");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, './.env'),
});
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [
        Users_1.Users,
        Products_1.Products,
        Media_1.Media,
        ProductFile_1.ProductFiles,
        Orders_1.Orders,
    ],
    routes: {
        admin: '/sell',
    },
    admin: {
        user: 'users',
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: '- DigitalMarketPlace',
            favicon: '/favicon.ico',
            ogImage: '/thumbnail.jpg',
        },
    },
    rateLimit: {
        max: 2000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'payload-types.ts'),
    },
});

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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const zod_1 = require("zod");
const get_payload_1 = require("../get-payload");
const query_validator_1 = require("../lib/validators/query-validator");
const auth_router_1 = require("./auth-router");
const trpc_1 = require("./trpc");
const payment_router_1 = require("./payment-router");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_router_1.authRouter,
    payment: payment_router_1.paymentRouter,
    getInfiniteProducts: trpc_1.publicProcedure
        .input(zod_1.z.object({
        limit: zod_1.z.number().min(1).max(100),
        cursor: zod_1.z.number().nullish(),
        query: query_validator_1.QueryValidator,
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { query, cursor } = input;
        const { sort, limit } = query, queryOpts = __rest(query, ["sort", "limit"]);
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const parsedQueryOpts = {};
        Object.entries(queryOpts).forEach(([key, value]) => {
            parsedQueryOpts[key] = {
                equals: value,
            };
        });
        const page = cursor || 1;
        const { docs: items, hasNextPage, nextPage, } = yield payload.find({
            collection: 'products',
            where: Object.assign({ approvedForSale: {
                    equals: 'approved',
                } }, parsedQueryOpts),
            sort,
            depth: 1,
            limit,
            page,
        });
        return {
            items,
            nextPage: hasNextPage ? nextPage : null,
        };
    })),
});

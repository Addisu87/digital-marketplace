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
exports.authRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("./trpc");
const get_payload_1 = require("../get-payload");
const account_credentials_validator_1 = require("../lib/validators/account-credentials-validator");
exports.authRouter = (0, trpc_1.router)({
    signUp: trpc_1.publicProcedure
        .input(account_credentials_validator_1.AuthCredentialsValidator)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        const { email, password } = input;
        const payload = yield (0, get_payload_1.getPayloadClient)();
        // check if user already exists
        const { docs: users } = yield payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email,
                },
            },
        });
        if (users.length !== 0)
            throw new server_1.TRPCError({ code: 'CONFLICT' });
        yield payload.create({
            collection: 'users',
            data: {
                email,
                password,
                role: 'user',
            },
        });
        return { success: true, sentToEmail: email };
    })),
    verifyEmail: trpc_1.publicProcedure
        .input(zod_1.z.object({ token: zod_1.z.string() }))
        .query((_b) => __awaiter(void 0, [_b], void 0, function* ({ input }) {
        const { token } = input;
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const isVerified = yield payload.verifyEmail({
            collection: 'users',
            token,
        });
        if (!isVerified)
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        return { success: true };
    })),
    signIn: trpc_1.publicProcedure
        .input(account_credentials_validator_1.AuthCredentialsValidator)
        .mutation((_c) => __awaiter(void 0, [_c], void 0, function* ({ input, ctx }) {
        const { email, password } = input;
        const { res } = ctx;
        const payload = yield (0, get_payload_1.getPayloadClient)();
        try {
            yield payload.login({
                collection: 'users',
                data: {
                    email,
                    password,
                },
                res,
            });
            return { success: true };
        }
        catch (err) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
    })),
});

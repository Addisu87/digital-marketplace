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
exports.ProductFiles = void 0;
const addUser = ({ req, data }) => {
    const user = req.user;
    return Object.assign(Object.assign({}, data), { user: user === null || user === void 0 ? void 0 : user.id });
};
const yourOwnAndPurchased = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
    const user = req.user;
    if ((user === null || user === void 0 ? void 0 : user.role) === 'admin')
        return true;
    if (!user)
        return false;
    const { docs: products } = yield req.payload.find({
        collection: 'products',
        depth: 0,
        where: {
            user: {
                equals: user.id,
            },
        },
    });
    const ownProductFileIds = products.map((prod) => prod.product_files).flat();
    const { docs: orders } = yield req.payload.find({
        collection: 'orders',
        depth: 2,
        where: {
            user: {
                equals: user.id,
            },
        },
    });
    const purchasedProductFileIds = orders
        .map((order) => {
        return order.products.map((product) => {
            if (typeof product === 'string')
                return req.payload.logger.error('Search depth not sufficient to find purchased file IDs');
            return typeof product.product_files === 'string'
                ? product.product_files
                : product.product_files.id;
        });
    })
        .filter(Boolean)
        .flat();
    return {
        id: {
            in: [...ownProductFileIds, ...purchasedProductFileIds],
        },
    };
});
exports.ProductFiles = {
    slug: 'product_files',
    admin: {
        hidden: ({ user }) => user.role !== 'admin',
    },
    hooks: {
        beforeChange: [addUser],
    },
    access: {
        read: yourOwnAndPurchased,
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
    },
    upload: {
        staticURL: '/product_files',
        staticDir: 'product_files',
        mimeTypes: ['image/*', 'font/*', 'application/postscript'],
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                condition: () => false,
            },
            hasMany: false,
            required: true,
        },
    ],
};

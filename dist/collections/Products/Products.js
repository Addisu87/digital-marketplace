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
exports.Products = void 0;
const helpers_1 = require("../../helpers");
const stripe_1 = require("../../lib/stripe");
const addUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, data, }) {
    const user = req.user;
    return Object.assign(Object.assign({}, data), { user: user.id });
});
const syncUser = (_b) => __awaiter(void 0, [_b], void 0, function* ({ req, doc, }) {
    const fullUser = yield req.payload.findByID({
        collection: 'users',
        id: req.user.id,
    });
    if (fullUser && typeof fullUser === 'object') {
        const { products } = fullUser;
        const allIDs = [
            ...((products === null || products === void 0 ? void 0 : products.map((product) => typeof product === 'object' ? product.id : product)) || []),
        ];
        const createdProductIDs = allIDs.filter((id, index) => allIDs.indexOf(id) === index);
        const dataToUpdate = [...createdProductIDs, doc.id];
        yield req.payload.update({
            collection: 'users',
            id: fullUser.id,
            data: {
                products: dataToUpdate,
            },
        });
    }
});
const isAdminOrHasAccess = () => ({ req: { user: _user } }) => {
    const user = _user;
    if (!user)
        return false;
    if (user.role === 'admin')
        return true;
    const userProductIDs = (user.products || []).reduce((acc, product) => {
        if (!product)
            return acc;
        if (typeof product === 'string') {
            acc.push(product);
        }
        else {
            acc.push(product.id);
        }
        return acc;
    }, []);
    return {
        id: {
            in: userProductIDs,
        },
    };
};
exports.Products = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: isAdminOrHasAccess(),
        update: isAdminOrHasAccess(),
        delete: isAdminOrHasAccess(),
    },
    hooks: {
        afterChange: [syncUser],
        beforeChange: [
            addUser,
            (args) => __awaiter(void 0, void 0, void 0, function* () {
                if (args.operation === 'create') {
                    const data = args.data;
                    const createdProduct = yield stripe_1.stripe.products.create({
                        name: data.name,
                        default_price_data: {
                            currency: 'USD',
                            unit_amount: Math.round(data.price * 100),
                        },
                    });
                    const updated = Object.assign(Object.assign({}, data), { stripeId: createdProduct.id, priceId: createdProduct.default_price });
                    return updated;
                }
                else if (args.operation === 'update') {
                    const data = args.data;
                    const updatedProduct = yield stripe_1.stripe.products.update(data.stripeId, {
                        name: data.name,
                        default_price: data.priceId,
                    });
                    const updated = Object.assign(Object.assign({}, data), { stripeId: updatedProduct.id, priceId: updatedProduct.default_price });
                    return updated;
                }
            }),
        ],
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            hasMany: false,
            admin: {
                condition: () => false,
            },
        },
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Product details',
        },
        {
            name: 'price',
            label: 'Price in USD',
            min: 0,
            max: 1000,
            type: 'number',
            required: true,
        },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: helpers_1.PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
            required: true,
        },
        {
            name: 'product_files',
            label: 'Product file(s)',
            type: 'relationship',
            required: true,
            relationTo: 'product_files',
            hasMany: false,
        },
        {
            name: 'approvedForSale',
            label: 'Product Status',
            type: 'select',
            defaultValue: 'pending',
            access: {
                create: ({ req }) => req.user.role === 'admin',
                read: ({ req }) => req.user.role === 'admin',
                update: ({ req }) => req.user.role === 'admin',
            },
            options: [
                {
                    label: 'Pending verification',
                    value: 'pending',
                },
                {
                    label: 'Approved',
                    value: 'approved',
                },
                {
                    label: 'Denied',
                    value: 'denied',
                },
            ],
        },
        {
            name: 'priceId',
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: 'text',
            admin: {
                hidden: true,
            },
        },
        {
            name: 'stripeId',
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: 'text',
            admin: {
                hidden: true,
            },
        },
        {
            name: 'images',
            type: 'array',
            label: 'Product images',
            minRows: 1,
            maxRows: 4,
            required: true,
            labels: {
                singular: 'Image',
                plural: 'Images',
            },
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
        },
    ],
};

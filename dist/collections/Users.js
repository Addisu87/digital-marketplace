"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const PrimaryActionEmail_1 = require("../app/components/email/PrimaryActionEmail");
const adminsAndUser = ({ req: { user } }) => {
    if (user.role === 'admin')
        return true;
    return {
        id: {
            equals: user.id,
        },
    };
};
// Verify user
exports.Users = {
    slug: 'users',
    auth: {
        verify: {
            generateEmailHTML: ({ token }) => {
                return (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: 'verify your account',
                    buttonText: 'Verify Account',
                    href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
                });
            },
        },
    },
    access: {
        create: () => true,
        read: adminsAndUser,
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
    },
    admin: {
        hidden: ({ user }) => user.role !== 'admin',
        defaultColumns: ['id'],
    },
    fields: [
        {
            name: 'products',
            label: 'Products',
            admin: {
                condition: () => false,
            },
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
        {
            name: 'product_files',
            label: 'Product files',
            admin: {
                condition: () => false,
            },
            type: 'relationship',
            relationTo: 'product_files',
            hasMany: true,
        },
        {
            name: 'role',
            defaultValue: 'user',
            required: true,
            type: 'select',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
            ],
        },
    ],
};

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptEmailHtml = exports.ReceiptEmail = void 0;
const React = __importStar(require("react"));
const components_1 = require("@react-email/components");
const date_fns_1 = require("date-fns");
const utils_1 = require("../../../lib/utils");
const ReceiptEmail = ({ email, date, orderId, products, }) => {
    const total = products.reduce((acc, curr) => acc + curr.price, 0) + 1;
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null, "Your DigitalMarketPlace Receipt"),
        React.createElement(components_1.Body, { className: 'font-sans bg-white' },
            React.createElement(components_1.Container, { className: 'mx-auto py-20 px-0 max-w-4xl' },
                React.createElement(components_1.Section, { className: 'mb-4' },
                    React.createElement(components_1.Column, null,
                        React.createElement(components_1.Img, { src: `${process.env.NEXT_PUBLIC_SERVER_URL}/thankyou.jpg`, width: '100', height: '100', alt: 'DigitalMarketPlace' })),
                    React.createElement(components_1.Column, { className: 'text-right', align: 'right' },
                        React.createElement(components_1.Text, { className: 'text-2xl font-light text-gray-600' }, "Receipt"))),
                React.createElement(components_1.Section, { className: 'bg-gray-100 rounded-lg text-sm mt-6' },
                    React.createElement(components_1.Row, { className: 'h-12' },
                        React.createElement(components_1.Column, { className: 'border-r border-b px-4 py-2' },
                            React.createElement(components_1.Text, { className: 'font-semibold text-gray-600' }, "EMAIL"),
                            React.createElement(components_1.Link, { className: 'text-blue-500' }, email)),
                        React.createElement(components_1.Column, { className: 'border-r border-b px-4 py-2' },
                            React.createElement(components_1.Text, { className: 'font-semibold text-gray-600' }, "INVOICE DATE"),
                            React.createElement(components_1.Text, null, (0, date_fns_1.format)(date, 'dd MMM yyyy'))),
                        React.createElement(components_1.Column, { className: 'px-4 py-2' },
                            React.createElement(components_1.Text, { className: 'font-semibold text-gray-600' }, "ORDER ID"),
                            React.createElement(components_1.Link, { className: 'text-blue-500' }, orderId)))),
                React.createElement(components_1.Section, { className: 'bg-gray-100 rounded-lg text-sm mt-8' },
                    React.createElement(components_1.Text, { className: 'bg-gray-200 px-2 py-1 font-semibold' }, "Order Summary"),
                    products.map((product) => {
                        var _a;
                        const { image } = product.images[0];
                        return (React.createElement(components_1.Section, { key: product.id, className: 'flex items-center py-2' },
                            React.createElement(components_1.Column, { className: 'w-16' }, typeof image !== 'string' && image.url ? (React.createElement(components_1.Img, { src: image.url, width: '64', height: '64', alt: 'Product Image', className: 'rounded-lg border border-gray-200' })) : null),
                            React.createElement(components_1.Column, { className: 'pl-4' },
                                React.createElement(components_1.Text, { className: 'font-semibold' }, product.name),
                                product.description ? (React.createElement(components_1.Text, { className: 'text-gray-600' }, product.description.length > 50
                                    ? ((_a = product.description) === null || _a === void 0 ? void 0 : _a.slice(0, 50)) + '...'
                                    : product.description)) : null,
                                React.createElement(components_1.Link, { href: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`, className: 'text-blue-500' }, "Download Asset")),
                            React.createElement(components_1.Column, { className: 'w-32 text-right', align: 'right' },
                                React.createElement(components_1.Text, { className: 'font-semibold' }, product.price))));
                    }),
                    React.createElement(components_1.Section, { className: 'flex items-center py-2' },
                        React.createElement(components_1.Column, { className: 'w-16' }),
                        React.createElement(components_1.Column, { className: 'pl-4' },
                            React.createElement(components_1.Text, { className: 'font-semibold' }, "Transaction Fee")),
                        React.createElement(components_1.Column, { className: 'w-32 text-right' },
                            React.createElement(components_1.Text, { className: 'font-semibold' }, (0, utils_1.formatPrice)(1))))),
                React.createElement(components_1.Hr, { className: 'my-6' }),
                React.createElement(components_1.Section, { className: 'flex justify-end' },
                    React.createElement(components_1.Column, { className: 'text-right' },
                        React.createElement(components_1.Text, { className: 'font-semibold text-gray-600' }, "TOTAL")),
                    React.createElement(components_1.Column, { className: 'border-l' }),
                    React.createElement(components_1.Column, { className: 'flex-grow text-right' },
                        React.createElement(components_1.Text, { className: 'font-semibold text-xl' }, (0, utils_1.formatPrice)(total)))),
                React.createElement(components_1.Hr, { className: 'my-6' }),
                React.createElement(components_1.Text, { className: 'text-center text-sm text-gray-600' },
                    React.createElement(components_1.Link, { href: '#' }, "Account Settings"),
                    " \u2022",
                    ' ',
                    React.createElement(components_1.Link, { href: '#' }, "Terms of Sale"),
                    " \u2022",
                    ' ',
                    React.createElement(components_1.Link, { href: '#' }, "Privacy Policy ")),
                React.createElement(components_1.Text, { className: 'text-center text-sm text-gray-600 mt-4' },
                    "Copyright \u00A9 2023 DigitalHippo Inc. ",
                    React.createElement("br", null),
                    ' ',
                    React.createElement(components_1.Link, { href: '#' }, "All rights reserved"))))));
};
exports.ReceiptEmail = ReceiptEmail;
const ReceiptEmailHtml = (props) => (0, components_1.render)(React.createElement(exports.ReceiptEmail, Object.assign({}, props)), {
    pretty: true,
});
exports.ReceiptEmailHtml = ReceiptEmailHtml;

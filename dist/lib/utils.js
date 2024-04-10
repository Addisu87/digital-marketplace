"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructMetadata = exports.formatPrice = exports.cn = void 0;
const tailwind_merge_1 = require("tailwind-merge");
const clsx_1 = require("clsx");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.cn = cn;
function formatPrice(price, options = {}) {
    const { currency = 'USD', notation = 'compact' } = options;
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation,
        maximumFractionDigits: 2,
    }).format(numericPrice);
}
exports.formatPrice = formatPrice;
function constructMetadata({ title = 'DigitalMarketPlace - the marketplace for digital assets', description = 'DigitalMarketPlace is an open-source marketplace for high-quality digital goods.', image = '/thumbnail.jpg', icons = '/favicon.ico', noIndex = false, } = {}) {
    return Object.assign({ title,
        description, openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                },
            ],
        }, twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@addisuhaile',
        }, icons, metadataBase: new URL('https://localhost:3000') }, (noIndex && {
        robots: {
            index: false,
            follow: false,
        },
    }));
}
exports.constructMetadata = constructMetadata;

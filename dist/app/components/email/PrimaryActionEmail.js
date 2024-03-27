"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PrimaryActionEmailHtml = exports.EmailTemplate = void 0;
var React = __importStar(require("react"));
var components_1 = require("@react-email/components");
var EmailTemplate = function (_a) {
    var actionLabel = _a.actionLabel, buttonText = _a.buttonText, href = _a.href;
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null, "The marketplace for high-quality digital goods."),
        React.createElement(components_1.Body, { className: 'bg-white font-sans' },
            React.createElement(components_1.Container, { className: 'mx-auto py-20 px-0' },
                React.createElement(components_1.Img, { src: "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/hippo-newsletter-sign-up.png"), width: '150', height: '150', alt: 'DigitalMarketPlace', className: 'mx-auto' }),
                React.createElement(components_1.Text, { className: 'text-base leading-6' }, "Hi there,"),
                React.createElement(components_1.Text, { className: 'text-base leading-6' },
                    "Welcome to DigitalMarketPlace, the marketplace for high quality digital goods. Use the button below to ",
                    actionLabel,
                    "."),
                React.createElement(components_1.Section, { className: 'text-center' },
                    React.createElement(components_1.Button, { className: 'px-4 py-3 bg-blue-600 rounded text-white text-base text-center block', href: href }, buttonText)),
                React.createElement(components_1.Text, { className: 'text-base leading-6' },
                    "Best,",
                    React.createElement("br", null),
                    "The DigitalMarketPlace team"),
                React.createElement(components_1.Hr, { className: 'border-gray-300 my-5' }),
                React.createElement(components_1.Text, { className: 'text-xs text-gray-500' }, "If you did not request this email, you can safely ignore it.")))));
};
exports.EmailTemplate = EmailTemplate;
var PrimaryActionEmailHtml = function (props) {
    return (0, components_1.render)(React.createElement(exports.EmailTemplate, __assign({}, props)), {
        pretty: true,
    });
};
exports.PrimaryActionEmailHtml = PrimaryActionEmailHtml;

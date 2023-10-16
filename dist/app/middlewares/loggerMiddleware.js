"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logLevel = process.env.APP_TYPE === "DEV" ? "debug" : "info";
const loggerMiddleware = (req, res, next) => {
    const userAgent = req.useragent;
    const browser = userAgent?.browser;
    const version = userAgent?.version;
    const os = userAgent?.os;
    console.log(`[${new Date().toISOString()}] ip: ${req.ip} ${req.method} ${req.url} status:${res.statusCode} {Browser: ${browser} Version: ${version} OS: ${os} }`);
    next();
};
exports.default = loggerMiddleware;

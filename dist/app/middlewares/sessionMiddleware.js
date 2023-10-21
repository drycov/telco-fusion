"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionMiddleware = (req, res, next) => {
    res.locals.session = {
        isAuthenticated: req.session.isAuthenticated || false,
        user: req.session.user || null,
    };
    next();
};
exports.default = sessionMiddleware;

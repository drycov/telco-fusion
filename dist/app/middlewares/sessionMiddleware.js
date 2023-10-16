"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionMiddleware = (req, res, next) => {
    const session = req.session;
    // Установим isAuthenticated в false, если не установлено
    if (session.isAuthenticated === undefined) {
        session.isAuthenticated = false;
    }
    res.locals.session = {
        isAuthenticated: session.isAuthenticated,
        user: session.user || null,
        // cart: session.cart || []
    };
    next();
};
exports.default = sessionMiddleware;

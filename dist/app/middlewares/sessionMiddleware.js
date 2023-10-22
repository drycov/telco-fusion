"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionMiddleware = (req, res, next) => {
    res.locals.session = {
        isAuthenticated: req.session.isAuthenticated || false,
        user: req.session.user || null,
        lang: req.session.lang || null
    };
    console.log(req.session.lang);
    next();
};
exports.default = sessionMiddleware;
